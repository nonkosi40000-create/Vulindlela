package com.example.vulindlela

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.vulindlela.network.Vouch

class VouchAdapter(private val vouches: List<Vouch>) : RecyclerView.Adapter<VouchAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvSkill: TextView = view.findViewById(R.id.tv_vouch_skill)
        val tvComment: TextView = view.findViewById(R.id.tv_vouch_comment)
        val tvGiver: TextView = view.findViewById(R.id.tv_vouch_giver)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_vouch_card, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = vouches[position]
        holder.tvSkill.text = "Skill: ${item.skill}"
        holder.tvComment.text = item.comment
        holder.tvGiver.text = "- From: ${item.giver.profile.fullName} (${item.giver.role})"
    }

    override fun getItemCount() = vouches.size
}