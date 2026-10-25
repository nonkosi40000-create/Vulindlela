package com.example.vulindlela

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.vulindlela.network.Opportunity
import com.google.android.material.chip.Chip

class OpportunityAdapter(
    private val opportunities: List<Opportunity>,
    private val onDetailsClick: (Opportunity) -> Unit
) : RecyclerView.Adapter<OpportunityAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvTitle: TextView = view.findViewById(R.id.tv_opp_title)
        val tvLocation: TextView = view.findViewById(R.id.tv_opp_location)
        val tvStipend: TextView = view.findViewById(R.id.tv_opp_stipend)
        val tvType: TextView = view.findViewById(R.id.tv_opp_type)
        val chipShield: Chip = view.findViewById(R.id.chip_shield)
        val btnDetails: Button = view.findViewById(R.id.btn_view_details)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_opportunity_card, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = opportunities[position]
        holder.tvTitle.text = item.title
        holder.tvLocation.text = item.location
        holder.tvStipend.text = if (item.stipend != null) "R${item.stipend.toInt()} / month" else "Stipend TBC"
        holder.tvType.text = item.type
        
        holder.chipShield.text = item.shield
        val shieldColor = when(item.shield) {
            "GREEN" -> R.color.brand_green
            "YELLOW" -> R.color.sunrise_gold
            else -> R.color.slate_900
        }
        holder.chipShield.setChipBackgroundColorResource(shieldColor)

        holder.btnDetails.setOnClickListener { onDetailsClick(item) }
    }

    override fun getItemCount() = opportunities.size
}