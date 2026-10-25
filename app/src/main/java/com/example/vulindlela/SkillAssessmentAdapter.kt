package com.example.vulindlela

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.vulindlela.network.SkillAssessment

class SkillAssessmentAdapter(
    private val assessments: List<SkillAssessment>,
    private val onItemClick: (SkillAssessment) -> Unit
) : RecyclerView.Adapter<SkillAssessmentAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvSkillName: TextView = view.findViewById(R.id.tv_skill_name)
        val tvStatus: TextView = view.findViewById(R.id.tv_status)
        val imgStatus: ImageView = view.findViewById(R.id.img_status_icon)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_skill_card, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = assessments[position]
        holder.tvSkillName.text = item.skillName
        holder.tvStatus.text = item.status
        
        val iconRes = when (item.status) {
            "VERIFIED" -> android.R.drawable.checkbox_on_background
            "COMPLETED" -> android.R.drawable.ic_menu_edit
            else -> android.R.drawable.ic_menu_help
        }
        holder.imgStatus.setImageResource(iconRes)
        
        holder.itemView.setOnClickListener { onItemClick(item) }
    }

    override fun getItemCount() = assessments.size
}