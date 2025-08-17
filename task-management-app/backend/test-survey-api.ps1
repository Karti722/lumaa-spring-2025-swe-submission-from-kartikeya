# PowerShell script to test all working survey API endpoints (excluding radio/select/checkbox)

$baseUrl = "http://127.0.0.1:5000/api"

Write-Host "\n=== SURVEY API ENDPOINTS TEST ===" -ForegroundColor Magenta

# 1. Get all surveys
Write-Host "\n1. Get All Surveys..." -ForegroundColor Yellow
try {
    $surveys = Invoke-RestMethod -Uri "$baseUrl/surveys" -Method Get
    Write-Host "✅ Surveys: $($surveys.Count) found" -ForegroundColor Green
} catch {
    Write-Host "❌ Surveys: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Create a new survey
Write-Host "\n2. Create Survey..." -ForegroundColor Yellow
$surveyBody = @{ title = "Test Survey $(Get-Date -Format 'HHmmss')"; description = "A test survey" } | ConvertTo-Json
try {
    $survey = Invoke-RestMethod -Uri "$baseUrl/surveys" -Method Post -ContentType "application/json" -Body $surveyBody
    Write-Host "✅ Create Survey: $($survey.id)" -ForegroundColor Green
    $surveyId = $survey.id
} catch {
    Write-Host "❌ Create Survey: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Get survey details
Write-Host "\n3. Get Survey Details..." -ForegroundColor Yellow
try {
    $details = Invoke-RestMethod -Uri "$baseUrl/surveys/$surveyId" -Method Get
    Write-Host "✅ Survey Details: $($details.title)" -ForegroundColor Green
} catch {
    Write-Host "❌ Survey Details: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Add questions (text, number, textarea, email)
$questions = @(
    @{ title = "Text Test"; questionType = "text" },
    @{ title = "Number Test"; questionType = "number" },
    @{ title = "Textarea Test"; questionType = "textarea" },
    @{ title = "Email Test"; questionType = "email" }
)
$questionIds = @()
$i = 1
foreach ($q in $questions) {
    Write-Host "\n4.$i Add $($q.questionType) question..." -ForegroundColor Yellow
    $body = $q | ConvertTo-Json
    try {
        $result = Invoke-RestMethod -Uri "$baseUrl/surveys/$surveyId/questions" -Method Post -ContentType "application/json" -Body $body
        Write-Host "✅ $($q.questionType) Question: $($result.id)" -ForegroundColor Green
        $questionIds += $result.id
    } catch {
        Write-Host "❌ $($q.questionType) Question: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
    $i++
}

# 5. Submit survey response
Write-Host "\n5. Submit Survey Response..." -ForegroundColor Yellow
$responses = @()
for ($j = 0; $j -lt $questionIds.Count; $j++) {
    $answer = switch ($j) {
        0 { "Sample text" }
        1 { "42" }
        2 { "Some long answer" }
        3 { "test@example.com" }
        default { "answer" }
    }
    $responses += @{ questionId = $questionIds[$j]; answer = $answer }
}
$submitBody = @{ responses = $responses } | ConvertTo-Json -Depth 3
try {
    $submit = Invoke-RestMethod -Uri "$baseUrl/surveys/$surveyId/submit" -Method Post -ContentType "application/json" -Body $submitBody
    Write-Host "✅ Submit Response: $($submit.sessionId)" -ForegroundColor Green
    $sessionId = $submit.sessionId
} catch {
    Write-Host "❌ Submit Response: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Get survey submission
Write-Host "\n6. Get Survey Submission..." -ForegroundColor Yellow
try {
    $submission = Invoke-RestMethod -Uri "$baseUrl/submissions/$sessionId" -Method Get
    Write-Host "✅ Get Submission: $($submission.responses.Count) responses" -ForegroundColor Green
} catch {
    Write-Host "❌ Get Submission: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "\n=== END OF TESTS ===" -ForegroundColor Magenta
