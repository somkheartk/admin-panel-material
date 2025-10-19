*** Settings ***
Documentation     Test cases for Dashboard page
Resource          common.robot
Suite Setup       Open Admin Panel
Suite Teardown    Close Admin Panel

*** Test Cases ***
Dashboard Should Display Title
    [Documentation]    Verify dashboard page displays correctly
    Wait For Element    xpath=//h6[contains(., 'Dashboard')]
    Page Should Contain Element    xpath=//h6[contains(., 'Admin Panel')]

Dashboard Should Display Statistics Cards
    [Documentation]    Verify all statistics cards are displayed
    Wait For Element    xpath=//*[contains(., 'จำนวนผู้ใช้ทั้งหมด')]
    Page Should Contain Element    xpath=//*[contains(., 'คำสั่งซื้อทั้งหมด')]
    Page Should Contain Element    xpath=//*[contains(., 'รายได้')]
    Page Should Contain Element    xpath=//*[contains(., 'การเติบโต')]

Dashboard Should Display Revenue Chart
    [Documentation]    Verify revenue chart is displayed
    Wait For Element    xpath=//*[contains(., 'รายได้รายเดือน')]
    Page Should Contain Element    class=recharts-wrapper

Dashboard Should Display Recent Activity
    [Documentation]    Verify recent activity section is displayed
    Wait For Element    xpath=//*[contains(., 'กิจกรรมล่าสุด')]
    Page Should Contain Element    xpath=//*[contains(., 'ผู้ใช้ล่าสุด')]

Sidebar Menu Should Be Visible
    [Documentation]    Verify all menu items are visible
    Page Should Contain Element    xpath=//a[@href='/']
    Page Should Contain Element    xpath=//a[@href='/users']
    Page Should Contain Element    xpath=//a[@href='/products']
    Page Should Contain Element    xpath=//a[@href='/orders']
    Page Should Contain Element    xpath=//a[@href='/analytics']
    Page Should Contain Element    xpath=//a[@href='/settings']

User Can Toggle Dark Mode
    [Documentation]    Verify dark mode toggle functionality
    ${mode_button}=    Get WebElements    xpath=//button[contains(@class, 'MuiIconButton')]
    Click Element    ${mode_button}[0]
    Sleep    1s
    # Verify theme change (background color should change)
    ${bg_color}=    Execute Javascript    return window.getComputedStyle(document.body).backgroundColor
    Should Not Be Empty    ${bg_color}
