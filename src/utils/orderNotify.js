// orderNotify.js — Sends a OneSignal push to the partner when a customer places an order.
// NOTE: For simplicity this calls the OneSignal REST API from the client. For production
// hardening, move this into a Cloudflare Pages Function so the REST key is never shipped
// to browsers. The order is already safely saved to Firestore + Realtime DB regardless.

const ONESIGNAL_APP_ID = '289acc0a-9fde-435e-aad7-aca9c0aca98d'
const ONESIGNAL_REST_API_KEY =
  'os_v2_app_fcnmycu73zbv5kwxvsu4blfjrxjhpbu4dp6ezx562jjsbpk3dpjrvuvypwzlfxhw2yta4qiupjmijw735zwj5nv6c3mx36ximt7un2q'

/**
 * Notify a partner of a new order via OneSignal push.
 * @param {object} params
 * @param {string} [params.playerId] - partner's OneSignal subscription id (from their user doc)
 * @param {string} [params.externalId] - partner's Firebase uid (fallback target)
 * @param {object} params.order - { id, orderId, total, customerName }
 * @returns {Promise<boolean>}
 */
export async function notifyPartner({ playerId, externalId, order }) {
  const target = playerId
    ? { include_player_ids: [playerId] }
    : externalId
    ? { include_external_user_ids: [externalId] }
    : null
  if (!target) return false

  const body = {
    app_id: ONESIGNAL_APP_ID,
    ...target,
    headings: { en: 'New Order Received!', bn: 'নতুন অর্ডার পেয়েছেন!' },
    contents: {
      en: `Order #${order.orderId} — ৳${order.total} from ${order.customerName}`,
      bn: `অর্ডার #${order.orderId} — ৳${order.total} — ${order.customerName}`,
    },
    url: `https://partner.flashcart.bsdc.info.bd/orders/${order.id || ''}`,
    data: { orderId: order.id, type: 'new_order' },
  }

  try {
    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${ONESIGNAL_REST_API_KEY}` },
      body: JSON.stringify(body),
    })
    return res.ok
  } catch {
    return false
  }
}
