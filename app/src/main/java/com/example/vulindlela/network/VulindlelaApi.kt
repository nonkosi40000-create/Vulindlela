package com.example.vulindlela.network

import retrofit2.Response
import retrofit2.http.*

interface VulindlelaApi {

    @POST("auth/otp/request")
    suspend fun requestOtp(@Body request: OtpRequest): Response<MessageResponse>

    @POST("auth/otp/verify")
    suspend fun verifyOtp(@Body request: VerifyOtpRequest): Response<LoginResponse>

    @POST("vula/profile-chat")
    suspend fun sendProfileMessage(@Body request: ChatRequest): Response<ChatResponse>

    @GET("opportunities")
    suspend fun getOpportunities(
        @Query("type") type: String? = null,
        @Query("area") area: String? = null
    ): Response<List<Opportunity>>

    @POST("opportunities/{id}/fit-score")
    suspend fun getFitScore(@Path("id") id: String): Response<FitScoreResponse>

    @POST("opportunities/{id}/apply")
    suspend fun applyForOpportunity(@Path("id") id: String): Response<ApplicationResponse>

    // Vetting Engine Endpoints
    @GET("assessments/my")
    suspend fun getMyAssessments(): Response<List<SkillAssessment>>

    @POST("assessments/start")
    suspend fun startAssessment(@Body request: StartAssessmentRequest): Response<SkillAssessment>

    @GET("assessments/tasks/{id}")
    suspend fun getAssessmentTask(@Path("id") id: String): Response<AssessmentTask>

    @POST("assessments/{id}/submit")
    suspend fun submitAssessment(
        @Path("id") id: String,
        @Body request: SubmitAssessmentRequest
    ): Response<SkillAssessment>

    // Vouching Endpoints
    @GET("vouch/my-vouches")
    suspend fun getMyVouches(): Response<List<Vouch>>

    // Shield / Scam Check
    @POST("vula/scam-check")
    suspend fun checkScam(@Body request: ScamCheckRequest): Response<ScamCheckResponse>

    @POST("vula/report-scam")
    suspend fun reportScam(@Body request: ReportScamRequest): Response<MessageResponse>
}
