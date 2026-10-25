package com.example.vulindlela.network

data class OtpRequest(val mobile: String)
data class VerifyOtpRequest(val mobile: String, val otp: String)
data class MessageResponse(val message: String)
data class LoginResponse(val accessToken: String, val user: UserInfo)
data class UserInfo(val id: String, val mobile: String, val role: String, val isProfileComplete: Boolean)

data class ChatRequest(val message: String, val history: List<ChatHistoryItem>)
data class ChatHistoryItem(val role: String, val parts: List<ChatPart>)
data class ChatPart(val text: String)
data class ChatResponse(val text: String)

data class Opportunity(
    val id: String,
    val title: String,
    val description: String,
    val type: String,
    val location: String,
    val stipend: Double?,
    val estimatedTaxi: Double?,
    val shield: String,
    val requirements: List<String>
)

data class FitScoreResponse(
    val score: Int,
    val explanation: String,
    val bridge: String?
)

data class ApplicationResponse(val id: String, val status: String)

data class StartAssessmentRequest(val skillName: String)
data class SubmitAssessmentRequest(val evidenceUrl: String)

data class SkillAssessment(
    val id: String,
    val skillName: String,
    val status: String,
    val score: Int?,
    val feedback: String?,
    val evidenceUrl: String?,
    val createdAt: String
)

data class AssessmentTask(
    val id: String,
    val opportunityId: String,
    val title: String,
    val description: String,
    val instructions: String,
    val deliverableType: String
)

data class Vouch(
    val id: String,
    val skill: String,
    val relationship: String,
    val comment: String,
    val giver: VouchGiver,
    val isVerified: Boolean
)

data class VouchGiver(val profile: VouchProfile, val role: String)
data class VouchProfile(val fullName: String)

data class ScamCheckRequest(val text: String)
data class ScamCheckResponse(
    val riskLevel: String,
    val reasons: List<String>,
    val explanation: String
)

data class ReportScamRequest(val text: String, val reason: String)
