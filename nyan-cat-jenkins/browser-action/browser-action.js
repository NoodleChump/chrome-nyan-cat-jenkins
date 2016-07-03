function validateSettings(settings) {
  //TODO: keep doing this, or just skip blanks on updateSettings?
  // if (settings.urlRules == '') {
  //   document.getElementById('settings-jenkins-url').style['border-bottom'] = '1px solid #cc0000';
  //   return false;
  // } else {
  //   document.getElementById('settings-jenkins-url').style['border-bottom'] = '1px solid #88cc00';
  // }

  return true;
}

function updateSettings(settings) {
  chrome.storage.sync.set(settings, null);
}

function fillSettings(settings) {
  // Find string by setting name and follow convention instead?
  if (settings.enabled != null) document.getElementById('settings-enabled').checked = settings.enabled;
  if (settings.disableBackground != null)
    document.getElementById('settings-disable-background').checked = settings.disableBackground;

  if (settings.urlRules != null && settings.urlRules.type) {
    document.getElementById('settings-url-type').value = settings.urlRules.type;
    document.getElementById('settings-url-' + settings.urlRules.type).selected = 'selected';

    // TODO And the urls list
    document.getElementById('settings-url-entry').value = settings.urlRules.urls[0];

    updateUrlRuleVisibility();
  }

  if (settings.enabled == false) enableExtensionSettings(false);
}

function refillSettings(settings) {
  if (settings == null) {
    chrome.storage.sync.get(fillSettings);
  } else {
    fillSettings(settings);
  }
}

function setFormSubmissionListener() {
  document.getElementById('settings-form').addEventListener('submit', function(e) {
    e.preventDefault();

    var settings = {
      'enabled': document.getElementById('settings-enabled').checked,
      'urlRules': {
        'type': document.getElementById('settings-url-type').value,
        'urls': [
          document.getElementById('settings-url-entry').value
        ]
      },
      'disableBackground': document.getElementById('settings-disable-background').checked
    };

    if (validateSettings(settings)) {
      updateSettings(settings);
      refillSettings();
    } else {
      refillSettings(settings);
    }
  }, false);
}

function enableExtensionSettings(enabled) {
  enabled = typeof enabled !== 'undefined' ? enabled : true;

  var form = document.getElementById('settings-form');
  var elements = form.elements;

  for (var i = 0, len = elements.length; i < len; ++i) {
    if (!(elements[i].id == 'settings-enabled') && !(elements[i].id == 'settings-form-submit'))
      elements[i].disabled = !enabled;
  }

  var extensionSettings = document.getElementById('extension-settings');
  if (enabled) {
    extensionSettings.style.height = 'auto';
  } else {
    extensionSettings.style.height = 0;
  }
}

function setEnabledListener() {
  var settingsEnabledCheckbox = document.getElementById('settings-enabled');

  settingsEnabledCheckbox.addEventListener('change', function() {
    if (settingsEnabledCheckbox.checked) {
      enableExtensionSettings();
    } else {
      enableExtensionSettings(false);
    }
  });
}

function updateUrlRuleVisibility() {
  var settingsUrlTypeCombo = document.getElementById('settings-url-type');
  var settingsUrlList = document.getElementById('settings-url-list');

  if (settingsUrlTypeCombo.value == 'any') {
    settingsUrlList.style.height = 0;
  } else {
    settingsUrlList.style.height = 'auto';
  }
}

function setUrlRulesListener() {
  document.getElementById('settings-url-type').addEventListener('change', function() {
    updateUrlRuleVisibility();
  });
}

function setListeners() {
  setFormSubmissionListener();
  setEnabledListener();
  setUrlRulesListener();
}

refillSettings();
setListeners();