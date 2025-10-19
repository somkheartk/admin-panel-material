*** Settings ***
Documentation     Common keywords and variables for all test suites
Library           SeleniumLibrary

*** Variables ***
${BROWSER}        headlesschrome
${BASE_URL}       http://localhost:3000
${BACKEND_URL}    http://localhost:3001
${DELAY}          0.5

*** Keywords ***
Open Admin Panel
    Open Browser    ${BASE_URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}

Close Admin Panel
    Close Browser

Navigate To Page
    [Arguments]    ${page}
    Click Element    xpath=//a[@href='${page}']
    Wait Until Location Contains    ${page}

Wait For Element
    [Arguments]    ${locator}    ${timeout}=10s
    Wait Until Element Is Visible    ${locator}    timeout=${timeout}

Fill Text Field
    [Arguments]    ${locator}    ${text}
    Wait For Element    ${locator}
    Input Text    ${locator}    ${text}

Click Button By Text
    [Arguments]    ${text}
    Click Element    xpath=//button[contains(., '${text}')]

Click Icon Button
    [Arguments]    ${aria_label}
    Click Element    xpath=//button[@aria-label='${aria_label}']

Verify Success Message
    [Arguments]    ${message}
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'MuiAlert') and contains(., '${message}')]

Verify Error Message
    [Arguments]    ${message}
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'MuiAlert') and contains(., '${message}')]

Table Should Contain Text
    [Arguments]    ${text}
    Wait Until Element Is Visible    xpath=//table//td[contains(., '${text}')]
