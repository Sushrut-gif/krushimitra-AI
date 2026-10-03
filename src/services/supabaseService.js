import { supabase } from '../lib/supabaseClient';

/**
 * Service to manage Supabase data synchronization with fallback handling
 */

/**
 * Fetch all listings from Supabase
 */
export async function fetchSupabaseListings() {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchListings notice:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('[Supabase] fetchListings error:', err);
    return [];
  }
}

/**
 * Fetch all bids from Supabase
 */
export async function fetchSupabaseBids() {
  try {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchBids notice:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('[Supabase] fetchBids error:', err);
    return [];
  }
}

/**
 * Insert a new listing into Supabase
 */
export async function insertSupabaseListing(listing) {
  try {
    const payload = {
      id: listing.id,
      farmer_name: listing.farmerName || 'शेतकरी',
      farmer_mobile: listing.farmerMobile || '',
      crop_name: listing.cropName,
      grade: listing.qualityGrade || 'मध्यम',
      quantity: Number(listing.quantity) || 1,
      unit: listing.unit || 'क्विंटल',
      base_price: Number(listing.basePrice) || 0,
      status: listing.status || 'बोली सुरू',
      highest_bid: Number(listing.basePrice) || 0,
      location: listing.location || '',
      gate_pass_id: listing.gatePassId || `GP-SLP-${listing.id}`,
    };

    const { data, error } = await supabase.from('listings').insert(payload).select();
    if (error) {
      console.warn('[Supabase] Insert listing notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err) {
    console.error('[Supabase] Insert listing error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Insert a new bid and update listing highest_bid
 */
export async function insertSupabaseBid(listingId, bidData) {
  try {
    // Generate valid UUID for bids table
    const bidId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : '00000000-0000-4000-8000-' + Date.now().toString().slice(-12).padStart(12, '0');

    const bidPayload = {
      id: bidId,
      listing_id: listingId,
      merchant_id: bidData.merchantId || null,
      merchant_name: bidData.merchantName || 'व्यापारी',
      amount: Number(bidData.amount) || 0,
    };

    // 1. Insert into bids
    const { error: bidErr } = await supabase.from('bids').insert(bidPayload);
    if (bidErr) {
      console.warn('[Supabase] Insert bid notice:', bidErr.message);
    }

    // 2. Update highest_bid in listings
    const { error: listErr } = await supabase
      .from('listings')
      .update({ highest_bid: Number(bidData.amount) })
      .eq('id', listingId);

    if (listErr) {
      console.warn('[Supabase] Update highest_bid notice:', listErr.message);
    }

    return { success: !bidErr && !listErr };
  } catch (err) {
    console.error('[Supabase] insertSupabaseBid exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Accept a bid: update status to 'विक्री पूर्ण' and set winning_merchant_id
 */
export async function acceptSupabaseBid(listingId, merchantId, winningPrice) {
  try {
    const { error } = await supabase
      .from('listings')
      .update({
        status: 'विक्री पूर्ण',
        winning_merchant_id: merchantId || 'MERCHANT_SLP_8841',
        highest_bid: Number(winningPrice) || 0,
      })
      .eq('id', listingId);

    if (error) {
      console.warn('[Supabase] Accept bid notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Accept bid exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Inward delivery scan: update status to 'यार्डात प्राप्त'
 */
export async function markSupabaseLotInward(listingId, gatePassId) {
  try {
    const targetId = (listingId || '').replace('GP-SLP-', '');
    const { error } = await supabase
      .from('listings')
      .update({
        status: 'यार्डात प्राप्त',
        gate_pass_id: gatePassId || `GP-SLP-${targetId}`,
      })
      .or(`id.eq.${targetId},gate_pass_id.eq.${listingId}`);

    if (error) {
      console.warn('[Supabase] Inward delivery notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Inward delivery exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Payment release: update payment_status to 'खात्यात जमा'
 */
export async function markSupabasePaymentReleased(listingId, utr) {
  try {
    const { error } = await supabase
      .from('listings')
      .update({
        payment_status: 'खात्यात जमा',
      })
      .eq('id', listingId);

    if (error) {
      console.warn('[Supabase] Payment release notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Payment release exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all registered merchants from Supabase
 */
export async function fetchSupabaseMerchants() {
  try {
    const { data, error } = await supabase
      .from('merchants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchMerchants notice:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('[Supabase] fetchMerchants error:', err);
    return [];
  }
}

/**
 * Update merchant status in Supabase (approve or suspend)
 */
export async function updateSupabaseMerchantStatus(merchantId, newStatus) {
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(merchantId);
    let query = supabase.from('merchants').update({ status: newStatus });
    if (isUUID) {
      query = query.eq('id', merchantId);
    } else {
      query = query.eq('license_no', merchantId);
    }

    const { error } = await query;
    if (error) {
      console.warn('[Supabase] Update merchant status notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error('[Supabase] Update merchant status error:', err);
    return { success: false, error: err.message };
  }
}
