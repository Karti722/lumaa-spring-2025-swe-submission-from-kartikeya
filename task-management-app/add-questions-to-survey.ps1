# PowerShell script to add questions to an existing survey via API
# Update $surveyId and $questions as needed

$surveyId = 25  # Change to your survey ID
$questions = @(
    @{ title = "How satisfied are you with our service?"; questionType = "radio"; options = @("Very satisfied","Satisfied","Neutral","Dissatisfied","Very dissatisfied"); required = $true },
    @{ title = "What did you like most about our service?"; questionType = "text"; required = $false },
    @{ title = "What can we improve?"; questionType = "text"; required = $false },
    @{ title = "How likely are you to recommend us?"; questionType = "radio"; options = @("Very likely","Likely","Unlikely","Very unlikely"); required = $true },
    @{ title = "How did you hear about us?"; questionType = "select"; options = @("Friend","Online","Advertisement","Other"); required = $false },
    @{ title = "How often do you use our service?"; questionType = "select"; options = @("Daily","Weekly","Monthly","Rarely"); required = $false },
    @{ title = "Any additional comments?"; questionType = "textarea"; required = $false },
    @{ title = "Rate your overall experience."; questionType = "radio"; options = @("Excellent","Good","Average","Poor"); required = $true }
)

foreach ($q in $questions) {
    if ($q.options) { $q.options = $q.options | ConvertTo-Json -Compress }
    $body = $q | ConvertTo-Json -Depth 5
    Invoke-RestMethod -Uri "http://localhost:5000/api/surveys/$surveyId/questions" -Method Post -ContentType 'application/json' -Body $body
    Write-Host "Added question: $($q.title)"
}
