*** Settings ***
Documentation     Test cases for Analytics page
Resource          common.robot
Suite Setup       Open Admin Panel
Suite Teardown    Close Admin Panel

*** Test Cases ***
Navigate To Analytics Page
    [Documentation]    Navigate to Analytics page
    Navigate To Page    /analytics
    Wait For Element    xpath=//*[contains(., 'การวิเคราะห์ข้อมูล')]

Analytics Should Display Charts
    [Documentation]    Verify all charts are displayed
    Wait For Element    xpath=//*[contains(., 'รายได้รายเดือน')]
    Page Should Contain Element    class=recharts-wrapper
    
    Page Should Contain Element    xpath=//*[contains(., 'การกระจายตามหมวดหมู่')]
    Page Should Contain Element    xpath=//*[contains(., 'แนวโน้มคำสั่งซื้อและผู้ใช้ใหม่')]
    Page Should Contain Element    xpath=//*[contains(., 'สถานะคำสั่งซื้อ')]

Analytics Charts Should Be Interactive
    [Documentation]    Verify charts are rendered properly
    ${charts}=    Get WebElements    class=recharts-wrapper
    ${chart_count}=    Get Length    ${charts}
    Should Be True    ${chart_count} >= 3    msg=Should have at least 3 charts
