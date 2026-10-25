package com.example.vulindlela

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RectF
import android.util.AttributeSet
import android.view.View
import androidx.core.content.ContextCompat

/**
 * CORE REQUIREMENT: C5. Reading Highlighter
 * Highlighting styles: line band, sentence, word-by-word.
 */
class HighlighterOverlay @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private val paint = Paint().apply {
        color = ContextCompat.getColor(context, R.color.sunrise_gold)
        alpha = 80 // Translucent overlay
        style = Paint.Style.FILL
    }

    private var highlightRect = RectF()

    fun updateHighlight(rect: RectF) {
        highlightRect = rect
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        if (!highlightRect.isEmpty) {
            canvas.drawRect(highlightRect, paint)
        }
    }
}
