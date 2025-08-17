# Survey API Testing Script
# Run this script when the server is running on localhost:5000

Write-Host "=== SURVEY API COMPREHENSIVE TEST ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param($name, $method, $url, $body = $null)
    
    Write-Host "Testing: $name" -ForegroundColor Yellow
    
    try {
        if ($body) {
            $result = Invoke-RestMethod -Uri $url -Method $method -ContentType "application/json" -Body $body
        } else {
            $result = Invoke-RestMethod -Uri $url -Method $method
        }
        
        Write-Host "✅ $name: PASSED" -ForegroundColor Green
        $script:testsPassed++
        return $result
    }
    catch {
        Write-Host "❌ $name: FAILED - $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $null
    }
}

# Test 1: Health Check
$health = Test-Endpoint "Health Check" "GET" "$baseUrl/health"

# Test 2: Get All Surveys
$surveys = Test-Endpoint "Get All Surveys" "GET" "$baseUrl/api/surveys"

# Test 3: Create Custom Survey
$surveyData = @{
    title = "Test Survey $(Get-Date -Format 'yyyyMMdd-HHmmss')"
    description = "A test survey created by the API test script"
} | ConvertTo-Json

$newSurvey = Test-Endpoint "Create Custom Survey" "POST" "$baseUrl/api/surveys" $surveyData

if ($newSurvey) {
    $surveyId = $newSurvey.id
    Write-Host "Created survey with ID: $surveyId" -ForegroundColor Blue
    
    # Test 4: Add Question to Survey
    $questionData = @{
        title = "What is your name?"
        description = "Please enter your full name"
        questionType = "text"
        required = $true
    } | ConvertTo-Json
    
    $question = Test-Endpoint "Add Question to Survey" "POST" "$baseUrl/api/surveys/$surveyId/questions" $questionData
    
    if ($question) {
        $questionId = $question.id
        Write-Host "Created question with ID: $questionId" -ForegroundColor Blue
        
        # Test 5: Get Survey Details
        $surveyDetails = Test-Endpoint "Get Survey Details" "GET" "$baseUrl/api/surveys/$surveyId"
        
        # Test 6: Submit Survey Response
        $responseData = @{
            responses = @(
                @{
                    questionId = $questionId
                    answer = "John Doe Test User"
                }
            )
        } | ConvertTo-Json -Depth 3
        
        $submission = Test-Endpoint "Submit Survey Response" "POST" "$baseUrl/api/surveys/$surveyId/submit" $responseData
        
        if ($submission) {
            $sessionId = $submission.sessionId
            Write-Host "Created submission with session ID: $sessionId" -ForegroundColor Blue
            
            # Test 7: Get Survey Submission
            Test-Endpoint "Get Survey Submission" "GET" "$baseUrl/api/submissions/$sessionId" | Out-Null
        }
    }
}

# Test 8: Create Sample Survey (this tests complex question creation)
Test-Endpoint "Create Sample Demographics Survey" "POST" "$baseUrl/api/surveys/sample/create" | Out-Null

Write-Host ""
Write-Host "=== TEST RESULTS ===" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor Red

if ($testsFailed -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED! Survey API is fully functional!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Check server logs for details." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Survey App Backend is ready for frontend integration!" -ForegroundColor Cyan
