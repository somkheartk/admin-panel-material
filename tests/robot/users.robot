*** Settings ***
Documentation     Test cases for Users CRUD operations
Resource          common.robot
Suite Setup       Open Admin Panel
Suite Teardown    Close Admin Panel

*** Variables ***
${TEST_USER_NAME}        ทดสอบ ผู้ใช้
${TEST_USER_EMAIL}       test.user@example.com
${TEST_USER_PHONE}       0812345678
${UPDATED_USER_NAME}     ทดสอบ ผู้ใช้ (แก้ไข)

*** Test Cases ***
Navigate To Users Page
    [Documentation]    Navigate to Users management page
    Navigate To Page    /users
    Wait For Element    xpath=//*[contains(., 'จัดการผู้ใช้')]

Users Page Should Display Table
    [Documentation]    Verify users table is displayed
    Wait For Element    xpath=//table
    Page Should Contain Element    xpath=//th[contains(., 'ชื่อ')]
    Page Should Contain Element    xpath=//th[contains(., 'อีเมล')]
    Page Should Contain Element    xpath=//th[contains(., 'เบอร์โทร')]

Create New User
    [Documentation]    Create a new user record
    Click Button By Text    เพิ่มผู้ใช้ใหม่
    Wait For Element    xpath=//*[contains(., 'เพิ่มผู้ใช้ใหม่')]
    
    Fill Text Field    name=name    ${TEST_USER_NAME}
    Fill Text Field    name=email    ${TEST_USER_EMAIL}
    Fill Text Field    name=phone    ${TEST_USER_PHONE}
    
    Click Button By Text    บันทึก
    Sleep    2s
    Table Should Contain Text    ${TEST_USER_EMAIL}

Verify User In Table
    [Documentation]    Verify created user appears in the table
    Table Should Contain Text    ${TEST_USER_NAME}
    Table Should Contain Text    ${TEST_USER_EMAIL}

Edit Existing User
    [Documentation]    Edit the created user
    # Find the edit button for our test user
    ${edit_buttons}=    Get WebElements    xpath=//table//button[.//svg[@data-testid='EditIcon']]
    # Click the last one (our newly created user)
    ${last_index}=    Evaluate    len(${edit_buttons}) - 1
    Click Element    ${edit_buttons}[${last_index}]
    
    Wait For Element    xpath=//*[contains(., 'แก้ไขผู้ใช้')]
    Fill Text Field    name=name    ${UPDATED_USER_NAME}
    Click Button By Text    บันทึก
    Sleep    2s
    Table Should Contain Text    ${UPDATED_USER_NAME}

Delete User
    [Documentation]    Delete the test user
    # Find the delete button for our test user
    ${delete_buttons}=    Get WebElements    xpath=//table//button[.//svg[@data-testid='DeleteIcon']]
    ${last_index}=    Evaluate    len(${delete_buttons}) - 1
    Click Element    ${delete_buttons}[${last_index}]
    
    # Confirm deletion in browser dialog
    Handle Alert    ACCEPT
    Sleep    2s
    
    # Verify user is deleted
    Page Should Not Contain    ${TEST_USER_EMAIL}
