*** Settings ***
Documentation     Test cases for Settings page
Resource          common.robot
Suite Setup       Open Admin Panel
Suite Teardown    Close Admin Panel

*** Test Cases ***
Navigate To Settings Page
    [Documentation]    Navigate to Settings page
    Navigate To Page    /settings
    Wait For Element    xpath=//*[contains(., 'การตั้งค่าระบบ')]

Settings Should Display All Sections
    [Documentation]    Verify all settings sections are displayed
    Page Should Contain Element    xpath=//*[contains(., 'การตั้งค่าทั่วไป')]
    Page Should Contain Element    xpath=//*[contains(., 'การตั้งค่าการแจ้งเตือน')]
    Page Should Contain Element    xpath=//*[contains(., 'การตั้งค่าความปลอดภัย')]

User Can Modify General Settings
    [Documentation]    Test general settings modification
    Wait For Element    name=siteName
    Input Text    name=siteName    Test Admin Panel
    
    ${save_buttons}=    Get WebElements    xpath=//button[contains(., 'บันทึก')]
    Click Element    ${save_buttons}[0]
    
    # Verify success message
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'MuiAlert')]    timeout=5s

User Can Toggle Notification Settings
    [Documentation]    Test notification toggle switches
    ${switches}=    Get WebElements    xpath=//input[@type='checkbox']
    ${switch_count}=    Get Length    ${switches}
    Should Be True    ${switch_count} >= 5    msg=Should have at least 5 switches

User Can Modify Security Settings
    [Documentation]    Test security settings modification
    Wait For Element    name=sessionTimeout
    Input Text    name=sessionTimeout    60
    
    ${save_buttons}=    Get WebElements    xpath=//button[contains(., 'บันทึก')]
    ${last_index}=    Evaluate    len(${save_buttons}) - 1
    Click Element    ${save_buttons}[${last_index}]
    
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'MuiAlert')]    timeout=5s
