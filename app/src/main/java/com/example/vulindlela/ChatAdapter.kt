package com.example.vulindlela

import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView

class ChatAdapter(private val messages: MutableList<ChatMessage>) : RecyclerView.Adapter<ChatAdapter.ChatViewHolder>() {

    class ChatViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvMessage: TextView = view.findViewById(R.id.tv_message)
        val cardBubble: CardView = view.findViewById(R.id.card_bubble)
        val container: LinearLayout = view as LinearLayout
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChatViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_chat_bubble, parent, false)
        return ChatViewHolder(view)
    }

    override fun onBindViewHolder(holder: ChatViewHolder, position: Int) {
        val message = messages[position]
        holder.tvMessage.text = message.text
        
        val params = holder.cardBubble.layoutParams as LinearLayout.LayoutParams
        if (message.isUser) {
            holder.container.gravity = Gravity.END
            holder.cardBubble.setCardBackgroundColor(holder.itemView.context.getColor(R.color.brand_green))
            params.marginStart = 100
            params.marginEnd = 0
        } else {
            holder.container.gravity = Gravity.START
            holder.cardBubble.setCardBackgroundColor(holder.itemView.context.getColor(R.color.slate_800))
            params.marginStart = 0
            params.marginEnd = 100
        }
        holder.cardBubble.layoutParams = params
    }

    override fun getItemCount() = messages.size

    fun addMessage(message: ChatMessage) {
        messages.add(message)
        notifyItemInserted(messages.size - 1)
    }
}