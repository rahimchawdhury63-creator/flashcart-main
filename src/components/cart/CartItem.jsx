// CartItem.jsx — A single line item in the cart with quantity controls and note.
import React from 'react'
import { useCart } from '../../hooks/useCart'
import { useLanguage } from '../../hooks/useLanguage'
import { IconPlus, IconMinus, IconTrash } from '../svgs'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem, setNote } = useCart()
  const { pick } = useLanguage()

  return (
    <div className="card">
      <div className="item-card">
        <img className="item-card-img" src={item.image} alt={pick(item.name)} />
        <div className="item-card-info">
          <h4 className="truncate" style={{ margin: 0 }}>{pick(item.name)}</h4>
          <span className="item-price">৳{item.price}</span>
          <input
            className="form-input mt-1"
            style={{ fontSize: '0.82rem', padding: '6px 10px' }}
            placeholder="Special note (optional)"
            value={item.specialNote}
            onChange={(e) => setNote(item.itemId, e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="qty">
            <button onClick={() => updateQuantity(item.itemId, item.quantity - 1)} aria-label="Decrease"><IconMinus size={16} /></button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.itemId, item.quantity + 1)} aria-label="Increase"><IconPlus size={16} /></button>
          </div>
          <button className="btn-icon btn-ghost" onClick={() => removeItem(item.itemId)} aria-label="Remove" style={{ color: 'var(--color-error)' }}>
            <IconTrash size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
