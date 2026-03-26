/************************************
 * Golden Age Treasures Ð BioCeutical Orchestrator
 * v2026-2-14 0220AM V2.7 - PRODUCTION
 *
 * ROUTING LOGIC:
 * 1. Bio-Only US Shipping ? Vitality (individual emails)
 * 2. Pickup (International/Local bio-only) ? Vitality (consolidated)
 * 3. Mixed/In-House (US/International/Local) ? Inventory Specialist (packing slips)
 ************************************/

const SHEET_CONFIG = 'Config';
const SHEET_EVENTS = 'Events';
const SHEET_ORDERS = 'Orders';
const SHEET_LINES = 'OrderLines';
const SHEET_LINES_EF = 'OrderLinesEffective';
const SHEET_UNITS = 'Units';
const SHEET_BIOVAR = 'BioCeuticalVar';
const SHEET_BATCH_HISTORY = 'BatchHistory';
const SHEET_BUNDLES = 'Bundles';

let CONFIG_CACHE = null;

const FIRST_BATCH_CUTOFF = new Date('2026-01-02T00:00:00-08:00');

const INHOUSE_PRODUCTS = [
  'blood balance',
  'liver longevity',
  'healthy heart',
  'superior spleen',
  'respiratory reset'
];


/************************************************
 * SACRED / DO NOT TOUCH (user-owned behavior)
 * - triage()
 * - classifyOrder_()
 * - isBioCeutical_()
 * - isInHouse_()
 * - getParentSku_()
 * - depleteStock_()
 * - recordBatch_()
 * - logEvent_()
 * - getSheet_()
 * - loadConfig_()
 * - getConfig_()
 ************************************************/

/************************************************
 * CUSTOM MENU
 ************************************************/

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('<=> Orchestrator')
    .addItem('[@] Run Setup Wizard', 'runSetupWizard')
    .addSeparator()
    .addItem('[@] 1) Triage Inbox Now', 'triage')
    .addItem('[@] 2) Trigger Batch Now', 'manualTriggerBatchWithUI')
    .addItem('[@] Generate Weekly Ops Digest Draft', 'sendWeeklyOpsDigestDraft')
    .addItem('[!] Quick Release Order', 'quickReleaseOrder')
    .addItem('[@] Batch Single Order', 'batchSingleOrder')
    .addSeparator()
    .addItem('[!] Reset Specific Orders', 'resetSpecificOrders')
    .addItem('[!!] RESET ALL ORDER DATA', 'resetAllOrderData')
    .addItem('[<>] Ignore to Inbox Recovery', 'reprocessIgnoredEmails')
    .addToUi();
}

/************************************************
 * SHEET + CONFIG HELPERS
 ************************************************/

function getSheet_(name, create) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh && create) {
    sh = ss.insertSheet(name);
  }
  return sh;
}

function ensureSheetWithHeader_(name, headers) {
  const sh = getSheet_(name, true);
  const lastCol = sh.getLastColumn();
  const lastRow = sh.getLastRow();
  
  if (lastRow === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    return sh;
  }
  
  const firstRowVals = sh.getRange(1, 1, 1, lastCol || headers.length).getValues()[0];
  const hasHeader = firstRowVals.some(v => v && String(v).trim() !== '');
  
  if (!hasHeader) {
    sh.clear();
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  return sh;
}

function ensureConfigSheet_() {
  return ensureSheetWithHeader_(SHEET_CONFIG, ['ConfigKey', 'ConfigValue']);
}

function ensureEventsSheet_() {
  return ensureSheetWithHeader_(SHEET_EVENTS, [
    'ts', 'type', 'threadId', 'msgId', 'classification', 'orderId', 'notes'
  ]);
}

function ensureOrdersSheet_() {
  return ensureSheetWithHeader_(SHEET_ORDERS, [
    'orderId',
    'status',
    'threadId',
    'msgId',
    'from',
    'subject',
    'createdTs',
    'shipName',
    'shipAddr1',
    'shipAddr2',
    'shipCityStatePostal',
    'shipCountry',
    'isLocal',
    'isUS',
    'hasBio',
    'hasNonBio',
    'hasInHouse',
    'isPriority',
    'shippingMethod',
    'shippingCost',
    'phone',
    'email',
    'customerNote',
    'holdUntil'
  ]);
}

function ensureOrderLinesSheet_() {
  return ensureSheetWithHeader_(SHEET_LINES, [
    'orderId',
    'productKey',
    'sku',
    'qtyRaw'
  ]);
}

function ensureOrderLinesEffectiveSheet_() {
  return ensureSheetWithHeader_(SHEET_LINES_EF, [
    'orderId',
    'productKey',
    'sku',
    'qtyRaw',
    'unitsPerLine',
    'effectiveUnits',
    'isBio',
    'isInHouse'
  ]);
}

function ensureUnitsSheet_() {
  return ensureSheetWithHeader_(SHEET_UNITS, [
    'skuOrKey',
    'unitsPerLine',
    'comment'
  ]);
}

function ensureBioVarSheet_() {
  return ensureSheetWithHeader_(SHEET_BIOVAR, [
    'Name',
    'Type',
    'SKU',
    'Parent SKU',
    'Variation Attribute 1 value(s)',
    'In HOUSE?',
    'In House Stock',
    'Sale price',
    'Regular price'
  ]);
}

function ensureBatchHistorySheet_() {
  return ensureSheetWithHeader_(SHEET_BATCH_HISTORY, [
    'batchId',
    'batchType',
    'sentTs',
    'orderIds',
    'totalOrders',
    'totalItems',
    'recipient',
    'status',
    'notes'
  ]);
}

function ensureBundlesSheet_() {
  const sh = ensureSheetWithHeader_(SHEET_BUNDLES, [
    'bundleKey',
    'componentName',
    'componentQty',
    'enabled',
    'notes'
  ]);

  // Seed defaults once (header-only sheet)
  if (sh.getLastRow() === 1) {
    const seed = [
      ['the super six', 'Galactic Gaia - Jar 400g ea', 1, 'Y', 'default'],
      ['the super six', 'Enlightened Earth - Bag 500g ea', 1, 'Y', 'default'],
      ['the super six', 'Magnesium Miracle - Bag 300g ea', 1, 'Y', 'default'],
      ['the super six', 'Immortal Monatomic - Bag 33g ea', 1, 'Y', 'default'],
      ['the super six', 'Biozymes - Bag 120 caps', 1, 'Y', 'default'],
      ['the super six', 'TriBiotic - Bag 120 caps', 1, 'Y', 'default'],
      ['super six', 'Galactic Gaia - Jar 400g ea', 1, 'Y', 'alias'],
      ['super six', 'Enlightened Earth - Bag 500g ea', 1, 'Y', 'alias'],
      ['super six', 'Magnesium Miracle - Bag 300g ea', 1, 'Y', 'alias'],
      ['super six', 'Immortal Monatomic - Bag 33g ea', 1, 'Y', 'alias'],
      ['super six', 'Biozymes - Bag 120 caps', 1, 'Y', 'alias'],
      ['super six', 'TriBiotic - Bag 120 caps', 1, 'Y', 'alias'],
      ['the faithful five', 'Galactic Gaia - Bag 200g ea', 1, 'Y', 'default'],
      ['the faithful five', 'Enlightened Earth - Bag 500g ea', 1, 'Y', 'default'],
      ['the faithful five', 'Magnesium Miracle - Bag 300g ea', 1, 'Y', 'default'],
      ['the faithful five', 'Biozymes - Bag 120 caps', 1, 'Y', 'default'],
      ['the faithful five', 'TriBiotic - Bag 120 caps', 1, 'Y', 'default'],
      ['faithful five', 'Galactic Gaia - Bag 200g ea', 1, 'Y', 'alias'],
      ['faithful five', 'Enlightened Earth - Bag 500g ea', 1, 'Y', 'alias'],
      ['faithful five', 'Magnesium Miracle - Bag 300g ea', 1, 'Y', 'alias'],
      ['faithful five', 'Biozymes - Bag 120 caps', 1, 'Y', 'alias'],
      ['faithful five', 'TriBiotic - Bag 120 caps', 1, 'Y', 'alias']
    ];
    sh.getRange(2, 1, seed.length, 5).setValues(seed);
  }

  return sh;
}

function loadConfig_() {
  if (CONFIG_CACHE) return CONFIG_CACHE;
  const sh = ensureConfigSheet_();
  const values = sh.getDataRange().getValues();
  const map = {};
  for (let i = 1; i < values.length; i++) {
    const key = String(values[i][0] || '').trim();
    const val = String(values[i][1] || '').trim();
    if (key) map[key] = val;
  }

  if (!map.INBOX_LABEL) map.INBOX_LABEL = 'Orchestrator/Inbox';
  if (!map.ORDER_LABEL) map.ORDER_LABEL = 'Orchestrator/Order';
  if (!map.TRACKING_LABEL) map.TRACKING_LABEL = 'Orchestrator/Tracking';
  if (!map.IGNORE_LABEL) map.IGNORE_LABEL = 'Orchestrator/Ignore';
  if (!map.ERROR_LABEL) map.ERROR_LABEL = 'Orchestrator/Errors';
  if (!map.VITALITY_TO) map.VITALITY_TO = Session.getActiveUser().getEmail();
  if (!map.TREASURE_ADMIN) map.TREASURE_ADMIN = Session.getActiveUser().getEmail();
  if (!map.TREASURE_INVENTORY_SPECIALIST) map.TREASURE_INVENTORY_SPECIALIST = Session.getActiveUser().getEmail();
  if (!map.ORDER_SENDERS) map.ORDER_SENDERS = '';
  if (!map.TRACKING_SENDERS) map.TRACKING_SENDERS = '';
  if (!map.BATCH_DAYS) map.BATCH_DAYS = '5';
  if (!map.BATCH_TIME) map.BATCH_TIME = '20';
  if (!map.TEST_BATCH_TO) map.TEST_BATCH_TO = '';
  if (!map.GO_LIVE) map.GO_LIVE = 'FALSE';

  CONFIG_CACHE = map;
  return map;
}

function getConfig_(key, def) {
  const cfg = loadConfig_();
  if (cfg[key] != null && String(cfg[key]).length) return cfg[key];
  return def !== undefined ? def : '';
}

function getConfigList_(key) {
  const raw = getConfig_(key, '');
  if (!raw) return [];
  return raw
    .split(/[,;\n]/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.toLowerCase());
}

function logEvent_(type, threadId, msgId, classification, orderId, notes) {
  const sh = ensureEventsSheet_();
  sh.appendRow([
    new Date(),
    type,
    threadId || '',
    msgId || '',
    classification || '',
    orderId || '',
    notes || ''
  ]);
}

function label_(thread, addLabel, removeLabels) {
  if (addLabel) addLabel.addToThread(thread);
  (removeLabels || []).forEach(l => {
    if (l) l.removeFromThread(thread);
  });
}

function getLastBatchTsByType_(batchType) {
  const sh = ensureBatchHistorySheet_();
  const values = sh.getDataRange().getValues();
  if (values.length <= 1) return FIRST_BATCH_CUTOFF;

  let lastTs = FIRST_BATCH_CUTOFF;

  for (let i = values.length - 1; i >= 1; i--) {
    const row = values[i];
    const type = String(row[1] || '').trim();
    const ts = row[2];

    if (type === batchType && ts instanceof Date) {
      lastTs = ts;
      break;
    }
  }

  return lastTs;
}

function recordBatch_(batchType, orderIds, totalItems, recipient, notes) {
  const sh = ensureBatchHistorySheet_();
  const now = new Date();
  const batchId = 'BATCH_' + Utilities.formatDate(now, getPrimaryTimeZone_(), 'yyyyMMdd_HHmmss');
  
  sh.appendRow([
    batchId,
    batchType,
    now,
    orderIds.join(','),
    orderIds.length,
    totalItems,
    recipient,
    'SENT',
    notes || ''
  ]);
  
  return batchId;
}

function getNextBusinessDay_(fromDate) {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + 1);
  
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  
  return date;
}

function extractCustomerNote_(body) {
  if (!body) return '';
  
  const patterns = [
    /Customer note\s*\n\s*(.+?)(?:\n|$)/i,
    /Customer provided note:\s*(.+?)(?:\n|$)/i,
    /Note from customer:\s*(.+?)(?:\n|$)/i,
    /Customer note:\s*(.+?)(?:\n|$)/i,
    /\*Customer provided note\*\s*(.+?)(?:\n|$)/i
  ];
  
  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return '';
}

function shouldAutoHold_(customerNote) {
  if (!customerNote) return false;
  
  const noteLower = customerNote.toLowerCase();
  
  const holdKeywords = [
    'hold',
    'wait',
    'delay',
    'ship after',
    'send after',
    'don\'t ship',
    'do not ship',
    'please wait'
  ];
  
  return holdKeywords.some(keyword => noteLower.includes(keyword));
}

function extractUspsTracking_(text) {
  if (!text) return [];
  const set = {};
  
  const a = text.match(/\b\d{20,22}\b/g) || [];
  const b = text.match(/\b[A-Z0-9]{2}\d{9}US\b/gi) || [];
  const c = text.match(/\b1Z[0-9A-Z]{16}\b/g) || [];
  
  a.concat(b, c).forEach(x => {
    const t = x.trim();
    if (t) set[t] = true;
  });
  
  return Object.keys(set);
}

function looksLikeNewOrderEmail_(subject, body) {
  const subj = String(subject || '').trim();
  const txt = String(body || '');
  return /^\[Golden Age Treasures.*\]:\s*You.?ve got a new order:\s*#\d+/i.test(subj) &&
    !/^fwd:/i.test(subj) &&
    !/^re:/i.test(subj) &&
    /You.?ve received a new order from/i.test(txt) &&
    /Congratulations on the sale\./i.test(txt);
}


/************************************************
 * TRIAGE ENTRYPOINT
 ************************************************/

function triage() {
  const cfg = loadConfig_();
  const L_IN = GmailApp.getUserLabelByName(cfg.INBOX_LABEL);
  const L_ORD = GmailApp.getUserLabelByName(cfg.ORDER_LABEL) || GmailApp.createLabel(cfg.ORDER_LABEL);
  const L_TRK = GmailApp.getUserLabelByName(cfg.TRACKING_LABEL) || GmailApp.createLabel(cfg.TRACKING_LABEL);
  const L_IGN = GmailApp.getUserLabelByName(cfg.IGNORE_LABEL) || GmailApp.createLabel(cfg.IGNORE_LABEL);
  const L_ERR = GmailApp.getUserLabelByName(cfg.ERROR_LABEL) || GmailApp.createLabel(cfg.ERROR_LABEL);

  if (!L_IN) {
    Logger.log('Label ' + cfg.INBOX_LABEL + ' not found.');
    return;
  }

  ensureOrdersSheet_();
  ensureOrderLinesSheet_();
  ensureUnitsSheet_();
  ensureOrderLinesEffectiveSheet_();
  ensureBioVarSheet_();
  ensureBatchHistorySheet_();
  ensureBundlesSheet_();
  ensureParserDebugSheet_();

  const orderSenders = getConfigList_('ORDER_SENDERS');
  const trackingSenders = getConfigList_('TRACKING_SENDERS');

  // Safety: fail closed if ORDER_SENDERS is empty (avoid wildcard intake in production)
  if (!orderSenders.length) {
    const alertTo = [cfg.TREASURE_ADMIN, cfg.TREASURE_INVENTORY_SPECIALIST].filter(Boolean).join(',');
    const alertSubj = '[!!] Orchestrator Config Error: ORDER_SENDERS is empty';
    const alertBody = 'Triage aborted because ORDER_SENDERS is empty.\n' +
      'No order emails were processed to prevent noisy inbox misclassification.\n\n' +
      'Action: populate ORDER_SENDERS in Config immediately.';
    if (alertTo) GmailApp.sendEmail(alertTo, alertSubj, alertBody);
    logEvent_('config-error', '', '', 'order-senders-empty', '', 'Triage aborted; ORDER_SENDERS empty');
    return;
  }

  const threads = L_IN.getThreads(0, 50);

  threads.forEach(thread => {
    try {
      const msgs = thread.getMessages();
      if (!msgs || !msgs.length) return;

      const last = msgs[msgs.length - 1];
      const from = (last.getFrom() || '').toLowerCase();
      const subject = last.getSubject() || '';
      const body = last.getPlainBody() || '';

      const isTrackingSender = trackingSenders.length > 0 && trackingSenders.some(a => a && from.indexOf(a) !== -1);
      if (isTrackingSender) {
        const trackingNums = extractUspsTracking_(body);
        if (trackingNums.length > 0) {
          processTrackingThread_(thread, last, trackingNums);
          label_(thread, L_TRK, [L_IN, L_ERR]);
          return;
        }
        label_(thread, L_IGN, [L_IN, L_ERR]);
        logEvent_('ignore', thread.getId(), last.getId(), 'tracking-no-match', '', 'Tracking sender but no tracking number');
        return;
      }

      const isOrderSender = !orderSenders.length || orderSenders.some(a => a && from.indexOf(a) !== -1);
      if (isOrderSender && looksLikeNewOrderEmail_(subject, body)) {
        const orderId = extractOrderId_(subject, body);
        if (orderId) {
          const ok = processOrderThread_(thread, last, orderId, body);
          label_(thread, ok ? L_ORD : L_ERR, [L_IN]);
          return;
        }
      }

      label_(thread, L_IGN, [L_IN, L_ERR]);
      const maybeOrderId = extractOrderId_(subject, body) || '';
      logEvent_('ignore', thread.getId(), last.getId(), 'no-match', maybeOrderId, 'No order or tracking match');

    } catch (err) {
      Logger.log('Error processing thread: ' + err);
      label_(thread, L_ERR, [L_IN]);
      logEvent_('error', thread.getId(), '', 'exception', '', err.toString());
    }
  });
}



function extractOrderId_(subject, body) {
  const patterns = [
    /Order #(\d+)/i,
    /Order Number:\s*(\d+)/i,
    /#(\d{5,})/
  ];
  
  for (const pattern of patterns) {
    let match = subject.match(pattern);
    if (match && match[1]) return match[1].trim();
    
    match = body.match(pattern);
    if (match && match[1]) return match[1].trim();
  }
  
  return null;
}

function processOrderThread_(thread, msg, orderId, body) {
  const ordersSh = ensureOrdersSheet_();
  const values = ordersSh.getDataRange().getValues();
  const existingIdx = {};

  for (let i = 1; i < values.length; i++) {
    const id = String(values[i][0] || '').trim();
    if (id) existingIdx[id] = i + 1;
  }

  if (existingIdx[orderId]) {
    ordersSh.getRange(existingIdx[orderId], 2).setValue('DUPLICATE');
    logEvent_('order-duplicate', thread.getId(), msg.getId(), 'duplicate', orderId, 'Duplicate order detected');
    return false;
  }

  const parsed = parseOrderEmail_(body);
  if (!parsed || !parsed.items || !parsed.items.length) {
    logEvent_('order-parse-fail', thread.getId(), msg.getId(), 'parse-error', orderId, 'Failed to parse order lines');
    return false;
  }

  const customerNote = extractCustomerNote_(body);
  const holdUntil = shouldAutoHold_(customerNote) ? getNextBusinessDay_(new Date()) : '';

  ordersSh.appendRow([
    orderId,
    holdUntil ? 'HOLD' : 'NEW',
    thread.getId(),
    msg.getId(),
    msg.getFrom(),
    msg.getSubject(),
    msg.getDate(),
    parsed.shipName,
    parsed.shipAddr1,
    parsed.shipAddr2,
    parsed.shipCityStatePostal,
    parsed.shipCountry,
    parsed.isLocal ? 'Y' : 'N',
    parsed.isUS ? 'Y' : 'N',
    '',
    '',
    '',
    parsed.isPriority ? 'Y' : 'N',
    parsed.shippingMethod,
    parsed.shippingCost,
    parsed.phone,
    parsed.email,
    customerNote,
    holdUntil
  ]);

  const linesSh = ensureOrderLinesSheet_();
  parsed.items.forEach(item => {
    linesSh.appendRow([
      orderId,
      item.productKey,
      item.sku,
      item.qty
    ]);
  });

  rebuildOrderLinesEffective();

  logEvent_('order-registered', thread.getId(), msg.getId(), 'order', orderId, 
    'Registered: ' + parsed.items.length + ' items' + (holdUntil ? ' (AUTO-HOLD)' : ''));

  if (parsed.isPriority) {
    sendPriorityOrderNotice_(orderId, parsed, customerNote);
  }

  return true;
}

function sendPriorityOrderNotice_(orderId, parsed, customerNote) {
  const cfg = loadConfig_();
  const specialist = String(cfg.TREASURE_INVENTORY_SPECIALIST || '').trim();
  const admin = String(cfg.TREASURE_ADMIN || '').trim();
  const supervisor = String(cfg.Treasure_Supervisor || cfg.TREASURE_SUPERVISOR || '').trim();

  const recipients = [specialist, admin, supervisor].filter(Boolean);
  if (!recipients.length) return;

  const to = recipients[0];
  const cc = recipients.slice(1).join(',');

  const subject = '[!] PRIORITY ORDER RECEIVED - #' + orderId;
  let body = '';
  body += 'A priority shipping order has been detected and queued for accelerated batching.\n\n';
  body += 'Order #' + orderId + '\n';
  body += (parsed.shipName || '') + '\n';
  if (parsed.shipAddr1) body += parsed.shipAddr1 + '\n';
  if (parsed.shipAddr2) body += parsed.shipAddr2 + '\n';
  if (parsed.shipCityStatePostal) body += parsed.shipCityStatePostal + '\n';
  if (parsed.shipCountry) body += parsed.shipCountry + '\n';
  body += 'Contact: ' + (parsed.phone || '') + ' | ' + (parsed.email || '') + '\n';
  body += 'Shipping: ' + (parsed.shippingMethod || '') + ' - ' + (parsed.shippingCost || '$0.00') + '\n';
  if (customerNote) body += 'Customer note: ' + String(customerNote).trim() + '\n';

  body += '\nPolicy reminder:\n';
  body += '- Priority participates in accelerated schedule (<= 3-day cycle max).\n';
  body += '- Manual batch override remains available when business-critical.\n';

  GmailApp.createDraft(to, subject, body, cc ? { cc: cc } : undefined);
  logEvent_('priority-notice', '', '', 'drafted', orderId, 'Priority notice draft prepared for specialist/admin');
}

function parseOrderEmail_(body) {
  const plain = String(body || '').replace(/\r/g, '');

  const result = {
    shipName: '', shipAddr1: '', shipAddr2: '', shipCityStatePostal: '', shipCountry: '',
    isLocal: false, isUS: false, isPriority: false,
    shippingMethod: '', shippingCost: '', phone: '', email: '', items: []
  };

  const billingBlockMatch = plain.match(/\*?Billing address\*?([\s\S]+?)\*?Shipping address\*?/i);
  const billingBlock = billingBlockMatch && billingBlockMatch[1] ? String(billingBlockMatch[1]) : '';

  const emailMatch = billingBlock.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/) ||
    plain.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/);
  if (emailMatch) result.email = String(emailMatch[1] || '').trim();

  const billingLines = billingBlock
    .split('\n')
    .map(s => String(s || '').trim())
    .filter(Boolean);
  for (let i = 0; i < billingLines.length; i++) {
    const ln = billingLines[i];
    if (ln.indexOf('@') !== -1) continue;
    const digitsOnly = ln.replace(/\D/g, '');
    if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
      result.phone = ln;
      break;
    }
  }
  if (!result.phone) {
    const phoneMatch = plain.match(/\b\+?[\d\s().-]{10,20}\b/);
    if (phoneMatch) result.phone = String(phoneMatch[0] || '').trim();
  }

  // Shipping can appear on one line OR split over multiple lines/columns in Woo emails.
  const shipLine = plain.match(/^\s*Shipping:\s*([^\n\r]+)$/im);
  if (shipLine && shipLine[1]) {
    let shippingTail = String(shipLine[1] || '').trim();
    // If line has duplicate method text (e.g. "Free shipping U.S. Free shipping U.S."), de-dup it.
    const dup = shippingTail.match(/^(.+?)\s+\1$/i);
    if (dup) shippingTail = dup[1].trim();

    // If same line also has price, split method/cost from the tail.
    const inlineCost = shippingTail.match(/^(.*?)(\$\s*\d+(?:\.\d{2})?)\s*$/);
    if (inlineCost) {
      result.shippingMethod = inlineCost[1].trim();
      result.shippingCost = inlineCost[2].replace(/\s+/g, '');
    } else {
      result.shippingMethod = shippingTail;

      // Free-shipping rows in Woo often duplicate method text with no currency value.
      if (/free\s+shipping/i.test(shippingTail)) {
        result.shippingCost = '$0.00';
      } else {
        // Look ahead near shipping line for first currency amount on the shipping row only.
        const afterShip = plain.slice(shipLine.index || 0, Math.min(plain.length, (shipLine.index || 0) + 260));
        const afterLines = afterShip.split('\n').map(s => String(s || '').trim()).filter(Boolean);
        for (let li = 0; li < afterLines.length; li++) {
          const ln = afterLines[li];
          if (/^(Total:|Payment method:)/i.test(ln)) break;
          if (/^(Subtotal:|Discount:)/i.test(ln)) continue;
          const m = ln.match(/\$\s*\d+(?:\.\d{2})?/);
          if (m) {
            result.shippingCost = m[0].replace(/\s+/g, '');
            break;
          }
        }
      }
    }
  }

  if (result.shippingMethod && !result.shippingCost) {
    result.shippingCost = '$0.00';
  }

  const methodLower = (result.shippingMethod || '').toLowerCase();
  result.isLocal = methodLower.includes('local') || methodLower.includes('pickup') || methodLower.includes('pick up');
  result.isPriority = methodLower.includes('priority') || methodLower.includes('express');

  let shipBlock = '';
  const mShip = plain.match(/\*?Shipping address\*?([\s\S]+?)Congratulations on the sale\./i);
  if (mShip && mShip[1]) shipBlock = mShip[1];
  if (shipBlock) {
    const idxStore = shipBlock.indexOf('Golden Age Treasures');
    if (idxStore >= 0) shipBlock = shipBlock.substring(0, idxStore);

    const addrLines = shipBlock
      .replace(/^[*>]+\s*/gm, '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .filter(s => !/^(shipping address|billing address)$/i.test(s))
      .filter(s => s.indexOf('@') === -1)
      .filter(s => !isLikelyPhoneLine_(s));

    if (addrLines.length) {
      result.shipName = addrLines[0] || '';
      const rest = addrLines.slice(1);
      if (rest.length === 1) {
        result.shipCityStatePostal = rest[0] || '';
      } else if (rest.length === 2) {
        result.shipAddr1 = rest[0] || '';
        result.shipCityStatePostal = rest[1] || '';
      } else if (rest.length >= 3) {
        result.shipAddr1 = rest[0] || '';
        result.shipAddr2 = rest[1] || '';
        result.shipCityStatePostal = rest[2] || '';
        if (rest.length >= 4) result.shipCountry = rest[3] || '';
      }
    }
  }

  if (!result.shipCountry) {
    const c = plain.match(/\b(United States|USA|US|Canada|UK|Australia)\b/i);
    if (c) result.shipCountry = c[1];
  }
  const usMatch = (result.shipCityStatePostal || '').match(/\b[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/);
  result.isUS = !!usMatch || /united states|usa|\bus\b/i.test(result.shipCountry || '');

  // Local-delivery geography override (treated like pickup/international routing)
  const cityLine = String(result.shipCityStatePostal || '').toLowerCase();
  const localCityMatch = /(ashland|phoenix|talent|medford)\s*,?\s*or\b/.test(cityLine);
  if (localCityMatch) result.isLocal = true;

  let text = plain;
  const idxStart = text.indexOf('New order: #');
  const idxEnd = text.indexOf('Subtotal:');
  if (idxEnd > 0) text = text.substring(idxStart >= 0 ? idxStart : 0, idxEnd);

  text = text.replace(/\[image:[^\]]*\]\s*/g, '');
  text = text.replace(/<\s*https?:\/\/[^\s>]+>/g, '');
  text = text.replace(/https?:\/\/\S+>?/g, '');
  text = text.replace(/^\s*[<>]+\s*/gm, '');

  const lns = text.split('\n').map(s => s.trim());
  const out = [];

  for (let i = 0; i < lns.length; i++) {
    const line = lns[i];
    const mQty = line.match(/^[×x]\s*(\d+)\b/);
    if (!mQty) continue;

    const qty = parseInt(mQty[1], 10);
    if (!qty || isNaN(qty)) continue;

    let sku = '';
    let skuRow = -1;
    for (let j = i - 1; j >= 0; j--) {
      const sLine = lns[j];
      const mSku = sLine.match(/\(#([A-Za-z0-9-]+)\)/);
      if (mSku) { sku = String(mSku[1] || '').trim().toUpperCase(); skuRow = j; break; }
      if (/^(Subtotal:|Discount:|Shipping:|Total:|\*Billing address\*|Order summary)/i.test(sLine)) break;
    }

    if (!sku || skuRow < 0) continue;

    const nameLines = [];
    for (let k = skuRow; k >= 0; k--) {
      const ln = lns[k];
      if (!ln) break;
      if (/^Backordered:/i.test(ln)) continue;
      if (/^[×x]\s*\d+/.test(ln)) break;
      if (/^(Order summary|Order #|\*Billing address\*)/i.test(ln)) break;
      if (/^(Subtotal:|Discount:|Shipping:|Total:)/i.test(ln)) break;
      if (ln.indexOf('@') !== -1) break;
      nameLines.unshift(ln);
      if (nameLines.length >= 3) break;
    }

    if (!nameLines.length) continue;
    let fullName = cleanProductName_(nameLines.join(' '));
    if (!fullName) continue;

    out.push({ productKey: fullName, sku: sku, qty: qty });
  }

  result.items = out;
  const dbgOrderMatch = plain.match(/New order:\s*#(\d{5,})/i);
  writeParserDebug_(dbgOrderMatch ? dbgOrderMatch[1] : '', shipBlock, out);
  return result;
}


function processTrackingThread_(thread, msg, trackingNums) {
  logEvent_('tracking', thread.getId(), msg.getId(), 'tracking', '', 
    'Tracking numbers: ' + trackingNums.join(', '));
}

function isLikelyPhoneLine_(s) {
  const v = String(s || '').trim();
  if (!v) return false;
  if (/[A-Za-z]/.test(v)) return false;
  return /^\+?[\d\s\-()]{10,}$/.test(v);
}

function getUnitsRules_() {
  const sh = ensureUnitsSheet_();
  const vals = sh.getDataRange().getValues();
  const rules = [];
  for (let i = 1; i < vals.length; i++) {
    const pattern = String(vals[i][0] || '').trim();
    if (!pattern) continue;
    const units = Number(vals[i][1] || 1) || 1;
    const emailName = String(vals[i][2] || '').trim();
    rules.push({ pattern: normalizePattern_(pattern), units: units, emailName: emailName });
  }
  return rules;
}

function normalizePattern_(s) {
  return cleanProductName_(s)
    .toLowerCase()
    .replace(/[\u2122\u00AE\u00A9]/g, '')
    .replace(/[’']/g, '')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getEmailDisplayName_(name, rules) {
  const cleaned = cleanProductName_(name);
  const n = normalizePattern_(cleaned);

  // Units sheet override wins when pattern matches
  for (let i = 0; i < rules.length; i++) {
    if (n.indexOf(rules[i].pattern) === 0 || n.indexOf(rules[i].pattern) >= 0) {
      return cleanProductName_(rules[i].emailName || cleaned);
    }
  }

  // Fallback normalization for known display quirks
  return cleaned
    .replace(/\b2\s+Jars?\s+or\s+Bags?\b/i, 'Bags')
    .replace(/\b2\s+Bags?\b/i, 'Bags')
    .replace(/\b2\s+Jars?\b/i, 'Jars')
    .replace(/Magnesium\s+Miracle\s+Bag\s+or\s+Jar/i, 'Magnesium Miracle')
    .replace(/[\u2122\u00AE\u00A9]/g, '')
    .trim();
}

function getBundleMap_() {
  const sh = ensureBundlesSheet_();
  const vals = sh.getDataRange().getValues();
  const map = {};

  for (let i = 1; i < vals.length; i++) {
    const key = normalizePattern_(String(vals[i][0] || ''));
    const component = cleanProductName_(String(vals[i][1] || ''));
    const qty = Number(vals[i][2] || 0) || 0;
    const enabled = String(vals[i][3] || 'Y').trim().toUpperCase();
    if (!key || !component || qty <= 0) continue;
    if (!(enabled === 'Y' || enabled === 'YES' || enabled === 'TRUE' || enabled === '1' || enabled === '')) continue;
    if (!map[key]) map[key] = [];
    map[key].push({ name: component, qty: qty });
  }

  return map;
}

function expandBundleLineItemsForVitality_(displayName, qty) {
  const raw = String(displayName || '').replace(/[\r\n]+/g, ' ').trim();
  const n = normalizePattern_(raw);
  const mult = Number(qty || 0) || 0;
  if (mult <= 0) return [];

  const bundleMap = getBundleMap_();
  if (bundleMap[n] && bundleMap[n].length) {
    return bundleMap[n].map(x => ({ name: cleanProductName_(x.name), qty: x.qty * mult }));
  }

  // Robust fallback when Units.emailName contains a pasted Super Six component blob.
  const blob = n;
  const looksLikeSuperSixBlob = blob.indexOf('galactic gaia') >= 0 && blob.indexOf('enlightened earth') >= 0 && blob.indexOf('magnesium miracle') >= 0 && blob.indexOf('immortal monatomic') >= 0 && blob.indexOf('biozymes') >= 0 && blob.indexOf('tribiotic') >= 0;
  if (looksLikeSuperSixBlob) {
    return [
      { name: 'Galactic Gaia - Jar 400g ea', qty: 1 * mult },
      { name: 'Enlightened Earth - Bag 500g ea', qty: 1 * mult },
      { name: 'Magnesium Miracle - Bag 300g ea', qty: 1 * mult },
      { name: 'Immortal Monatomic - Bag 33g ea', qty: 1 * mult },
      { name: 'Biozymes - Bag 120 caps', qty: 1 * mult },
      { name: 'TriBiotic - Bag 120 caps', qty: 1 * mult }
    ];
  }

  return [{ name: raw, qty: mult }];
}

function cleanProductName_(raw) {
  let s = String(raw || '').trim();
  s = s.replace(/[\u2018\u2019\u2032]/g, "'");
  s = s.replace(/[\u201C\u201D]/g, '"');
  s = s.replace(/^\s*\(?[A-Za-z]{3,9}\s+\d{1,2},\s*\d{4}\)\s*/i, '');
  s = s.replace(/^\s*\d{1,2},\s*\d{4}\)\s*/i, '');
  s = s.replace(/\bProduct\s+Quantity\s+Price\b/gi, ' ');
  s = s.replace(/\s*\(#([^)]+)\)\s*/g, ' ');
  s = s.replace(/\s*\(SKU:\s*[^)]+\)\s*/gi, ' ');
  s = s.replace(/\s*[×x]\s*\d+\s*$/i, '');
  s = s.replace(/^\s*[>]+\s*/g, '');
  s = s.replace(/[\u2122\u00AE\u00A9]/g, '');
  s = s.replace(/\s*-\s*/g, ' - ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}


function ensureParserDebugSheet_() {
  return ensureSheetWithHeader_('ParserDebug', ['ts', 'orderId', 'section', 'value']);
}

function writeParserDebug_(orderId, shipBlock, parsedItems) {
  try {
    const sh = ensureParserDebugSheet_();
    sh.appendRow([new Date(), orderId || '', 'shippingBlock', String(shipBlock || '')]);
    sh.appendRow([new Date(), orderId || '', 'itemsCount', String((parsedItems || []).length)]);
    sh.appendRow([new Date(), orderId || '', 'itemsPreview', (parsedItems || []).slice(0, 8).map(x => (x.productKey || '') + ' x' + (x.qty || 0)).join(' | ')]);
  } catch (e) {
    // best effort only
  }
}

/************************************************
 * EFFECTIVE LINES REBUILD
 ************************************************/

function rebuildOrderLinesEffective() {
  const linesSh = ensureOrderLinesSheet_();
  const effSh = ensureOrderLinesEffectiveSheet_();
  const unitsSh = ensureUnitsSheet_();
  const bioSh = ensureBioVarSheet_();

  effSh.clear();
  effSh.getRange(1, 1, 1, 8).setValues([[
    'orderId', 'productKey', 'sku', 'qtyRaw', 'unitsPerLine', 'effectiveUnits', 'isBio', 'isInHouse'
  ]]);

  const unitsMap = {};
  const unitsVals = unitsSh.getDataRange().getValues();
  const unitRules = [];
  for (let i = 1; i < unitsVals.length; i++) {
    const key = String(unitsVals[i][0] || '').trim().toLowerCase();
    const val = parseInt(unitsVals[i][1], 10);
    if (key && !isNaN(val)) { unitsMap[key] = val; unitRules.push({ key:key, units:val }); }
  }

  const skuBioMap = {};
  const skuInHouseMap = {};
  const skuStockMap = {};
  const parentNames = [];
  const stockByName = {};

  const bioVals = bioSh.getDataRange().getValues();
  for (let i = 1; i < bioVals.length; i++) {
    const nameRaw = String(bioVals[i][0] || '').trim();
    const name = nameRaw.toLowerCase();
    const sku = String(bioVals[i][2] || '').trim().toUpperCase();
    const parentSku = String(bioVals[i][3] || '').trim().toUpperCase();
    const inHouse = String(bioVals[i][5] || '').trim().toUpperCase();
    const stock = Number(bioVals[i][6] || 0) || 0;

    if (nameRaw) {
      const parentName = cleanProductName_(nameRaw.split(' - ')[0] || nameRaw).toLowerCase();
      if (parentName) parentNames.push(parentName);
      if (!stockByName[parentName] || stockByName[parentName] < stock) stockByName[parentName] = stock;
    }

    if (sku) {
      skuBioMap[sku] = true;
      skuInHouseMap[sku] = (inHouse === 'Y' || inHouse === 'YES');
      skuStockMap[sku] = stock;
    }
    if (parentSku) {
      skuBioMap[parentSku] = true;
      if (skuInHouseMap[parentSku] == null) skuInHouseMap[parentSku] = (inHouse === 'Y' || inHouse === 'YES');
      if (!skuStockMap[parentSku] || skuStockMap[parentSku] < stock) skuStockMap[parentSku] = stock;
    }
  }

  const linesVals = linesSh.getDataRange().getValues();
  const effRows = [];

  for (let i = 1; i < linesVals.length; i++) {
    const orderId = String(linesVals[i][0] || '').trim();
    const productKeyRaw = String(linesVals[i][1] || '').trim();
    const productKey = cleanProductName_(productKeyRaw);
    const sku = String(linesVals[i][2] || '').trim().toUpperCase();
    const qtyRaw = parseInt(linesVals[i][3], 10) || 1;

    let unitsPerLine = 1;
    const skuLower = sku.toLowerCase();
    const keyLower = productKey.toLowerCase();
    if (unitsMap[skuLower]) unitsPerLine = unitsMap[skuLower];
    else if (unitsMap[keyLower]) unitsPerLine = unitsMap[keyLower];
    else {
      for (let ur = 0; ur < unitRules.length; ur++) {
        if (keyLower.indexOf(unitRules[ur].key) === 0 || keyLower.indexOf(unitRules[ur].key) >= 0) {
          unitsPerLine = unitRules[ur].units;
          break;
        }
      }
    }

    const effectiveUnits = qtyRaw * unitsPerLine;

    let isBio = 'N';
    let isInHouse = 'N';

    const nameIsBio = parentNames.some(p => keyLower.indexOf(p) === 0 || keyLower.indexOf(p) >= 0);
    if ((sku && skuBioMap[sku]) || nameIsBio) isBio = 'Y';

    if (isBio === 'Y') {
      const stock = skuStockMap[sku] != null ? Number(skuStockMap[sku]) : Number(stockByName[(productKey.split(' - ')[0] || '').toLowerCase()] || 0);
      const biovarInHouse = skuInHouseMap[sku] === true;
      const stockInHouse = stock > 0;
      isInHouse = (biovarInHouse && stockInHouse) ? 'Y' : 'N';
    } else {
      isInHouse = 'Y';
    }

    effRows.push([orderId, productKey, sku, qtyRaw, unitsPerLine, effectiveUnits, isBio, isInHouse]);
  }

  if (effRows.length > 0) effSh.getRange(2, 1, effRows.length, 8).setValues(effRows);
  updateOrderFlags_();
}


function updateOrderFlags_() {
  const ordersSh = ensureOrdersSheet_();
  const effSh = ensureOrderLinesEffectiveSheet_();

  const orderVals = ordersSh.getDataRange().getValues();
  const effVals = effSh.getDataRange().getValues();

  const orderMap = {};

  for (let i = 1; i < effVals.length; i++) {
    const orderId = String(effVals[i][0] || '').trim();
    const isBio = effVals[i][6] === 'Y';
    const isInHouse = effVals[i][7] === 'Y';

    if (!orderMap[orderId]) {
      orderMap[orderId] = { hasBio: false, hasNonBio: false, hasInHouse: false };
    }

    if (isBio) orderMap[orderId].hasBio = true;
    if (!isBio) orderMap[orderId].hasNonBio = true;
    if (isInHouse) orderMap[orderId].hasInHouse = true;
  }

  for (let i = 1; i < orderVals.length; i++) {
    const orderId = String(orderVals[i][0] || '').trim();
    const flags = orderMap[orderId];

    if (flags) {
      ordersSh.getRange(i + 1, 15).setValue(flags.hasBio ? 'Y' : 'N');
      ordersSh.getRange(i + 1, 16).setValue(flags.hasNonBio ? 'Y' : 'N');
      ordersSh.getRange(i + 1, 17).setValue(flags.hasInHouse ? 'Y' : 'N');
    }
  }
}

/************************************************
 * BATCH PROCESSING - FIXED ROUTING
 ************************************************/

function manualTriggerBatch() {
  processBatches_(true);
  Logger.log('Manual batch processing complete');
}

function manualTriggerBatchWithUI() {
  processBatches_(true);
  SpreadsheetApp.getUi().alert('<=> Batch Complete', 'Batch processing triggered manually.', SpreadsheetApp.getUi().ButtonSet.OK);
}

function scheduledBatchCheck() {
  // Backward-compatible trigger target name used by existing time-based triggers.
  buildBatchDrafts();
}

function getPrimaryTimeZone_() {
  // Primary: script timezone. Fallback: fixed business timezone.
  try {
    const tz = Session.getScriptTimeZone ? Session.getScriptTimeZone() : '';
    if (tz) return tz;
  } catch (e) {}
  return 'America/Los_Angeles';
}

function buildBatchDrafts() {
  const cfg = loadConfig_();
  const batchTime = parseInt(cfg.BATCH_TIME || '20', 10);
  const batchDays = parseInt(cfg.BATCH_DAYS || '5', 10);

  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour < batchTime) {
    Logger.log('Skipping batch: before batch time (' + batchTime + ':00)');
    return;
  }

  if (!isAllowedDispatchDay_(now)) {
    Logger.log('Skipping batch: blocked dispatch day (Fri/Sat)');
    return;
  }

  const lastBatchTs = getLastBatchTs_();
  const todayStr = Utilities.formatDate(now, getPrimaryTimeZone_(), 'yyyy-MM-dd');
  const lastBatchDate = lastBatchTs
    ? Utilities.formatDate(lastBatchTs, getPrimaryTimeZone_(), 'yyyy-MM-dd')
    : '';

  if (lastBatchDate === todayStr) {
    Logger.log('Skipping batch: already batched today');
    return;
  }

  const hasPriorityPending = hasPendingPrioritySince_(lastBatchTs, now);
  const priorityStats = getPriorityQueueStats_(lastBatchTs, now);
  const effectiveBatchDays = hasPriorityPending ? Math.min(batchDays, 3) : batchDays;

  if (lastBatchTs && !hasBatchCycleElapsed_(lastBatchTs, now, effectiveBatchDays)) {
    Logger.log('Skipping batch: cycle not elapsed (effectiveDays=' + effectiveBatchDays + ', baseDays=' + batchDays + ', priority=' + (hasPriorityPending ? 'Y' : 'N') + ', priorityQueueCount=' + priorityStats.priorityQueueCount + ', oldestPriorityAgeHours=' + priorityStats.oldestPriorityAgeHours + ')');
    if (hasPriorityPending) {
      logEvent_('priority-queue', '', '', 'pending', '', 'priorityQueueCount=' + priorityStats.priorityQueueCount + '; oldestPriorityAgeHours=' + priorityStats.oldestPriorityAgeHours + '; effectiveDays=' + effectiveBatchDays);
    }
    return;
  }

  Logger.log('Running scheduled batch at ' + currentHour + ':00 (effectiveDays=' + effectiveBatchDays + ', priority=' + (hasPriorityPending ? 'Y' : 'N') + ', priorityQueueCount=' + priorityStats.priorityQueueCount + ', oldestPriorityAgeHours=' + priorityStats.oldestPriorityAgeHours + ')');
  processBatches_(false, { windowStartTs: lastBatchTs || null, windowEndTs: now });
}

function isAllowedDispatchDay_(dt) {
  const day = dt.getDay(); // 0=Sun ... 5=Fri ... 6=Sat
  return day !== 5 && day !== 6;
}

function getLastBatchTs_(batchType) {
  if (batchType) return getLastBatchTsByType_(batchType);

  const sh = ensureBatchHistorySheet_();
  const values = sh.getDataRange().getValues();
  if (values.length <= 1) return null;

  for (let i = values.length - 1; i >= 1; i--) {
    const ts = values[i][2];
    if (ts instanceof Date) return ts;
  }

  return null;
}

function getLastBatchDate_() {
  const lastTs = getLastBatchTs_();
  if (!lastTs) return '';
  return Utilities.formatDate(lastTs, getPrimaryTimeZone_(), 'yyyy-MM-dd');
}

function hasBatchCycleElapsed_(lastBatchTs, now, batchDays) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const lastDay = new Date(lastBatchTs.getFullYear(), lastBatchTs.getMonth(), lastBatchTs.getDate());
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const elapsedDays = Math.floor((nowDay.getTime() - lastDay.getTime()) / msPerDay);
  return elapsedDays >= batchDays;
}

function hasPendingPrioritySince_(windowStartTs, now) {
  return getPriorityQueueStats_(windowStartTs, now).priorityQueueCount > 0;
}

function getPriorityQueueStats_(windowStartTs, now) {
  const ordersSh = ensureOrdersSheet_();
  const vals = ordersSh.getDataRange().getValues();

  let priorityQueueCount = 0;
  let oldestPriorityAgeHours = 0;

  for (let i = 1; i < vals.length; i++) {
    const row = vals[i];
    const status = String(row[1] || '').trim();
    if (status !== 'NEW') continue;

    const createdTs = row[6] instanceof Date ? row[6] : null;
    const isPriority = row[17] === 'Y';
    const holdUntil = row[23];

    if (!isPriority) continue;
    if (holdUntil && holdUntil instanceof Date && holdUntil > now) continue;
    if (windowStartTs && createdTs && createdTs <= windowStartTs) continue;

    priorityQueueCount++;

    const ageHours = createdTs ? Math.max(0, Math.round(((now.getTime() - createdTs.getTime()) / 3600000) * 10) / 10) : 0;
    if (ageHours > oldestPriorityAgeHours) oldestPriorityAgeHours = ageHours;
  }

  return {
    priorityQueueCount: priorityQueueCount,
    oldestPriorityAgeHours: oldestPriorityAgeHours
  };
}

function processBatches_(isManual, options) {
  const opts = options || {};
  const windowStartTs = opts.windowStartTs instanceof Date ? opts.windowStartTs : null;
  const windowEndTs = opts.windowEndTs instanceof Date ? opts.windowEndTs : null;

  const ordersSh = ensureOrdersSheet_();
  const effSh = ensureOrderLinesEffectiveSheet_();

  const orderVals = ordersSh.getDataRange().getValues();
  const effVals = effSh.getDataRange().getValues();
  const now = new Date();

  const hasExternalBio = {};
  for (let i = 1; i < effVals.length; i++) {
    const oid = String(effVals[i][0] || '').trim();
    if (!oid) continue;
    const isBio = effVals[i][6] === 'Y';
    const isInHouse = effVals[i][7] === 'Y';
    if (isBio && !isInHouse) hasExternalBio[oid] = true;
  }

  const bioOnlyUS = [];
  const pickup = [];
  const mixed = [];

  for (let i = 1; i < orderVals.length; i++) {
    const row = orderVals[i];
    const orderId = String(row[0] || '').trim();
    const status = String(row[1] || '').trim();
    const createdTs = row[6] instanceof Date ? row[6] : null;
    const holdUntil = row[23];
    if (!orderId || status !== 'NEW') continue;
    if (holdUntil && holdUntil instanceof Date && holdUntil > now) continue;

    if (!isManual && windowStartTs && createdTs && createdTs <= windowStartTs) continue;
    if (!isManual && windowEndTs && createdTs && createdTs > windowEndTs) continue;

    const isLocal = row[12] === 'Y';
    const isUS = row[13] === 'Y';
    const hasNonBio = row[15] === 'Y';
    const hasInHouse = row[16] === 'Y';
    const extBio = !!hasExternalBio[orderId];

    const pureUSBio = isUS && !isLocal && extBio && !hasNonBio && !hasInHouse;
    if (pureUSBio) {
      bioOnlyUS.push(orderId);
      continue;
    }

    if (extBio) pickup.push(orderId);
    // Specialist gets ALL orders except pure US bio-only
    mixed.push(orderId);
  }

  if (bioOnlyUS.length > 0) createBioOnlyBatch_(bioOnlyUS, isManual);
  if (pickup.length > 0) createPickupBatch_(pickup, isManual);
  if (mixed.length > 0) createMixedBatch_(mixed, isManual);

  Logger.log('Batch complete: ' + bioOnlyUS.length + ' bio-only, ' + pickup.length + ' pickup, ' + mixed.length + ' mixed');
}

function getMergeIdentityKey_(row) {
  const name = String(row.shipName || '').trim();
  const parts = name.split(/\s+/).filter(Boolean);
  const first = (parts[0] || '').toLowerCase();
  const last = (parts.length ? parts[parts.length - 1] : '').toLowerCase();
  const person = (first + '|' + last).trim();

  const addr1 = String(row.shipAddr1 || '').toLowerCase()
    .replace(/\bdrive\b/g, 'dr')
    .replace(/\bstreet\b/g, 'st')
    .replace(/\broad\b/g, 'rd')
    .replace(/\bavenue\b/g, 'ave')
    .replace(/[^a-z0-9]/g, '');
  const city = String(row.shipCityStatePostal || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const country = String(row.shipCountry || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const email = String(row.email || '').toLowerCase().trim();
  const phone = String(row.phone || '').replace(/\D/g, '');
  const contact = email || phone || '';

  return [person, addr1, city, country, contact].join('|');
}

function getSortedKeys_(obj) {
  return Object.keys(obj || {}).sort((a, b) => String(a).localeCompare(String(b), 'en', { sensitivity: 'base' }));
}

function createBioOnlyBatch_(orderIds, isManual) {
  const cfg = loadConfig_();
  const goLive = (cfg.GO_LIVE || 'FALSE').toUpperCase() === 'TRUE';
  // Always target VITALITY_TO for this path (draft or send)
  const recipient = cfg.VITALITY_TO;
  const cc = cfg.TREASURE_ADMIN;

  const ordersSh = ensureOrdersSheet_();

  // Merge US bio-only orders for same person + same address into one draft
  const groups = {};
  orderIds.forEach(orderId => {
    const row = findOrderRow_(ordersSh, orderId);
    if (!row) return;
    const key = getMergeIdentityKey_(row);
    if (!groups[key]) groups[key] = [];
    groups[key].push(orderId);
  });

  Object.keys(groups).forEach(k => {
    sendIndividualBioNotification_(groups[k], recipient, cc, goLive);
  });

  updateOrderStatuses_(ordersSh, orderIds, 'BATCHED_US_BIO');
  recordBatch_('US_BIO', orderIds, orderIds.length, recipient, isManual ? 'Manual trigger' : 'Scheduled');
}

function sendIndividualBioNotification_(orderIds, recipient, cc, goLive) {
  const ordersSh = ensureOrdersSheet_();
  const effSh = ensureOrderLinesEffectiveSheet_();
  const unitsRules = getUnitsRules_();

  const ids = Array.isArray(orderIds) ? orderIds : [orderIds];
  if (!ids.length) return;

  const orderRow = findOrderRow_(ordersSh, ids[0]);
  if (!orderRow) return;

  const consolidatedItems = {};
  ids.forEach(orderId => {
    const lines = getOrderLines_(effSh, orderId);
    lines.forEach(line => {
      if (line.isBio === 'Y' && line.isInHouse === 'N') {
        const itemName = getEmailDisplayName_(line.productKey, unitsRules);
        const expanded = expandBundleLineItemsForVitality_(itemName, line.effectiveUnits);
        expanded.forEach(e => {
          if (!consolidatedItems[e.name]) consolidatedItems[e.name] = 0;
          consolidatedItems[e.name] += Number(e.qty || 0);
        });
      }
    });
  });

  let body = 'BioCeutical Order #' + ids.join(', #') + '\n\n';
  body += 'Ship To:\n';
  body += (orderRow.shipName || '') + '\n';
  if (orderRow.shipAddr1) body += orderRow.shipAddr1 + '\n';
  if (orderRow.shipAddr2) body += orderRow.shipAddr2 + '\n';
  if (orderRow.shipCityStatePostal) body += orderRow.shipCityStatePostal + '\n';
  if (orderRow.shipCountry) body += orderRow.shipCountry + '\n';
  body += '\nItems:\n';

  getSortedKeys_(consolidatedItems).forEach(name => {
    body += '  [_] ' + name + ' x' + consolidatedItems[name] + '\n';
  });

  const dateStr = Utilities.formatDate(new Date(), getPrimaryTimeZone_(), 'MM-dd-yy');
  const subject = '<=> BioCeutical Order #' + ids.join(', #') + ', ' + dateStr + ' ' + (orderRow.shipName || '');

  if (goLive) GmailApp.sendEmail(recipient, subject, body, { cc: cc });
  else GmailApp.createDraft(recipient, subject, body, { cc: cc });

  logEvent_('individual-bio-notification', '', '', 'sent', ids.join(','), 'US bio notification to Vitality');
}


function createPickupBatch_(orderIds, isManual) {
  const cfg = loadConfig_();
  const goLive = (cfg.GO_LIVE || 'FALSE').toUpperCase() === 'TRUE';
  // Always target VITALITY_TO for this path (draft or send)
  const recipient = cfg.VITALITY_TO;
  const cc = [cfg.TREASURE_INVENTORY_SPECIALIST, cfg.TREASURE_ADMIN].filter(Boolean).join(',');

  const ordersSh = ensureOrdersSheet_();
  const effSh = ensureOrderLinesEffectiveSheet_();
  const consolidatedItems = {};
  const unitsRules = getUnitsRules_();

  orderIds.forEach(orderId => {
    const lines = getOrderLines_(effSh, orderId);
    lines.forEach(line => {
      if (line.isBio === 'Y' && line.isInHouse === 'N') {
        const key = getEmailDisplayName_(line.productKey, unitsRules);
        const expanded = expandBundleLineItemsForVitality_(key, line.effectiveUnits);
        expanded.forEach(e => {
          if (!consolidatedItems[e.name]) consolidatedItems[e.name] = 0;
          consolidatedItems[e.name] += e.qty;
        });
      }
    });
  });

  const keys = getSortedKeys_(consolidatedItems);
  if (!keys.length) return;

  let body = 'BioCeutical Pickup Batch - Consolidated List\n\n';
  body += 'Items to prepare:\n\n';
  keys.forEach(key => { body += '  [_] ' + key + ' x' + consolidatedItems[key] + '\n'; });

  const totalUnits = keys.reduce((sum, k) => sum + consolidatedItems[k], 0);
  const subject = '[~*~] PICKUP: BioCeutical Batch - ' + totalUnits + ' items';
  if (goLive) GmailApp.sendEmail(recipient, subject, body, cc ? { cc: cc } : {});
  else GmailApp.createDraft(recipient, subject, body, cc ? { cc: cc } : {});

  updateOrderStatuses_(ordersSh, orderIds, 'BATCHED_PICKUP');
  recordBatch_('PICKUP', orderIds, totalUnits, recipient, isManual ? 'Manual trigger' : 'Scheduled');
}


function createMixedBatch_(orderIds, isManual) {
  const cfg = loadConfig_();
  const goLive = (cfg.GO_LIVE || 'FALSE').toUpperCase() === 'TRUE';
  // Always target specialist inbox for this path (draft or send)
  const recipient = cfg.TREASURE_INVENTORY_SPECIALIST;
  const cc = cfg.TREASURE_ADMIN;

  const ordersSh = ensureOrdersSheet_();
  const effSh = ensureOrderLinesEffectiveSheet_();

  const dateStr = Utilities.formatDate(new Date(), getPrimaryTimeZone_(), 'MM-dd-yy');

  const consolidatedItems = {};
  const unitsRules = getUnitsRules_();
  const orderDetails = [];

  orderIds.forEach(orderId => {
    const orderRow = findOrderRow_(ordersSh, orderId);
    if (!orderRow) return;

    const lines = getOrderLines_(effSh, orderId);
    const orderItems = [];

    lines.forEach(line => {
      const key = getEmailDisplayName_(line.productKey, unitsRules);

      // ONLY add to consolidated pull list if in-house OR non-bio.
      // External bio is for Vitality pickup list, not specialist pull consolidation.
      const isBio = line.isBio === 'Y';
      const isInHouse = line.isInHouse === 'Y';

      if (isInHouse || !isBio) {
        const expandedForConsolidated = expandBundleLineItemsForVitality_(key, line.effectiveUnits);
        expandedForConsolidated.forEach(e => {
          if (!consolidatedItems[e.name]) {
            consolidatedItems[e.name] = { qty: 0, isInHouse: isInHouse, isBio: isBio };
          }
          consolidatedItems[e.name].qty += e.qty;
        });
      }

      // Per-order (or merged-order) block still shows all items for packing context.
      orderItems.push({
        productKey: line.productKey,
        sku: line.sku,
        qty: line.effectiveUnits,
        isInHouse: isInHouse,
        isBio: isBio
      });
    });

    orderDetails.push({ orderId: orderId, orderRow: orderRow, items: orderItems });
  });

  // Merge by same person + same address
  const groups = {};
  orderDetails.forEach(order => {
    const key = getMergeIdentityKey_(order.orderRow);

    if (!groups[key]) {
      groups[key] = {
        orderIds: [],
        orderRows: [],
        itemsByName: {},
        hasPickupOnlyBio: false,
        hasMixed: false
      };
    }

    groups[key].orderIds.push(order.orderId);
    groups[key].orderRows.push(order.orderRow);

    let orderHasMixed = false;
    order.items.forEach(item => {
      const displayName = getEmailDisplayName_(item.productKey, unitsRules);
      const expandedForGroup = expandBundleLineItemsForVitality_(displayName, item.qty);
      expandedForGroup.forEach(e => {
        if (!groups[key].itemsByName[e.name]) groups[key].itemsByName[e.name] = 0;
        groups[key].itemsByName[e.name] += e.qty;
      });
      if (item.isInHouse || !item.isBio) orderHasMixed = true;
    });

    if (orderHasMixed) groups[key].hasMixed = true;
    else groups[key].hasPickupOnlyBio = true;
  });

  let body = '|-----------------------------------\n';
  body += 'STORAGE PICKUP LIST - ' + dateStr + '\n';
  body += '============================================================\n';
  body += 'CONSOLIDATED ITEMS TO PULL:\n';
  body += '============================================================\n\n';

  const inHouseItems = [];
  const nonBioItems = [];

  getSortedKeys_(consolidatedItems).forEach(key => {
    const item = consolidatedItems[key];
    const line = '  [_] ' + key + ' x' + item.qty + '\n';
    if (item.isInHouse) inHouseItems.push(line);
    else nonBioItems.push(line);
  });

  if (inHouseItems.length) {
    body += 'IN-HOUSE ITEMS:\n';
    inHouseItems.forEach(line => body += line);
    body += '\n';
  }

  if (nonBioItems.length) {
    body += 'NON-BIO ITEMS:\n';
    nonBioItems.forEach(line => body += line);
    body += '\n';
  }

  body += 'Orders included: ' + orderIds.join(', ') + '\n\n';
  body += '============================================================\n';
  body += 'PER-ORDER PACKING LIST (MERGED BY SAME NAME+ADDRESS):\n';
  body += '============================================================\n\n';

  getSortedKeys_(groups).forEach(groupKey => {
    const g = groups[groupKey];
    const head = g.orderRows[0] || {};
    const isLocal = head.isLocal === 'Y';

    if (g.orderIds.length > 1) {
      body += 'Combined Orders #' + g.orderIds.join(', #') + (isLocal ? ' - Local Pickup\n' : ' - Ship\n');
    } else {
      body += 'Order #' + g.orderIds[0] + (isLocal ? ' - Local Pickup\n' : ' - Ship\n');
    }

    body += (head.shipName || '') + '\n';
    if (head.shipAddr1) body += head.shipAddr1 + '\n';
    if (head.shipAddr2) body += head.shipAddr2 + '\n';
    if (head.shipCityStatePostal) body += head.shipCityStatePostal + '\n';
    if (head.shipCountry) body += head.shipCountry + '\n';
    if (head.phone || head.email) {
      body += 'Contact: ' + (head.phone || '') + ' | ' + (head.email || '') + '\n';
    }
    if (head.shippingMethod || head.shippingCost) {
      const shipText = String(head.shippingMethod || '').trim();
      const shipCost = String(head.shippingCost || '$0.00').trim();
      body += 'Shipping: ' + shipText + (shipCost ? (' - ' + shipCost) : '') + '\n';
    }
    if (head.customerNote) {
      body += 'Customer note: ' + String(head.customerNote || '').trim() + '\n';
    }

    if (g.orderIds.length > 1 && g.hasPickupOnlyBio && g.hasMixed) {
      body += '[!] ORDER SENT FOR PICKUP ONLY, VERIFY IF ORDER SHOULD BE SENT SEPERATELY\n';
    }

    body += '\nItems:\n';
    getSortedKeys_(g.itemsByName).forEach(name => {
      body += '  [_] ' + name + ' x' + g.itemsByName[name] + '\n';
    });

    body += '\n------------------------------------------------------------\n\n';
  });

  const subject = '[***] PACKING SLIPS Mixed Batch - ' + orderIds.length + ' Orders - ' + dateStr;

  if (goLive) GmailApp.sendEmail(recipient, subject, body, { cc: cc });
  else GmailApp.createDraft(recipient, subject, body, { cc: cc });

  updateOrderStatuses_(ordersSh, orderIds, 'BATCHED_MIXED');
  recordBatch_('MIXED', orderIds, orderDetails.reduce((sum, o) => sum + o.items.length, 0), recipient, isManual ? 'Manual trigger' : 'Scheduled');

  logEvent_('consolidated-packing-list', '', '', 'sent', orderIds.join(','), 'Consolidated list for inventory specialist');
}

function findOrderRow_(ordersSh, orderId) {
  const values = ordersSh.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    const id = String(values[i][0] || '').trim();
    if (id === orderId) {
      return {
        shipName: values[i][7],
        shipAddr1: values[i][8],
        shipAddr2: values[i][9],
        shipCityStatePostal: values[i][10],
        shipCountry: values[i][11],
        isLocal: values[i][12],
        isUS: values[i][13],
        isPriority: values[i][17],
        shippingMethod: values[i][18],
        shippingCost: values[i][19],
        phone: values[i][20],
        email: values[i][21],
        customerNote: values[i][22]
      };
    }
  }
  
  return null;
}

function getOrderLines_(effSh, orderId) {
  const values = effSh.getDataRange().getValues();
  const lines = [];
  
  for (let i = 1; i < values.length; i++) {
    const id = String(values[i][0] || '').trim();
    if (id === orderId) {
      lines.push({
        productKey: values[i][1],
        sku: values[i][2],
        qtyRaw: values[i][3],
        unitsPerLine: values[i][4],
        effectiveUnits: values[i][5],
        isBio: values[i][6],
        isInHouse: values[i][7]
      });
    }
  }
  
  return lines;
}

function updateOrderStatuses_(ordersSh, orderIds, newStatus) {
  const values = ordersSh.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    const id = String(values[i][0] || '').trim();
    if (orderIds.indexOf(id) !== -1) {
      ordersSh.getRange(i + 1, 2).setValue(newStatus);
    }
  }
}

/************************************************
 * QUICK RELEASE & BATCH SINGLE ORDER
 ************************************************/

function quickReleaseOrder() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Quick Release Order', 'Enter Order ID to release from hold:', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const orderId = response.getResponseText().trim();
  if (!orderId) {
    ui.alert('Error', 'No order ID provided.', ui.ButtonSet.OK);
    return;
  }
  
  const ordersSh = ensureOrdersSheet_();
  const values = ordersSh.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    const id = String(values[i][0] || '').trim();
    if (id === orderId) {
      ordersSh.getRange(i + 1, 2).setValue('NEW');
      ordersSh.getRange(i + 1, 24).setValue('');
      
      ui.alert('Success', 'Order #' + orderId + ' released and ready for batching.', ui.ButtonSet.OK);
      logEvent_('quick-release', '', '', 'released', orderId, 'Manual release from hold');
      return;
    }
  }
  
  ui.alert('Error', 'Order #' + orderId + ' not found.', ui.ButtonSet.OK);
}

function batchSingleOrder() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Batch Single Order', 'Enter Order ID to batch immediately:', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const orderId = response.getResponseText().trim();
  if (!orderId) {
    ui.alert('Error', 'No order ID provided.', ui.ButtonSet.OK);
    return;
  }
  
  const ordersSh = ensureOrdersSheet_();
  const values = ordersSh.getDataRange().getValues();
  
  let found = false;
  for (let i = 1; i < values.length; i++) {
    const id = String(values[i][0] || '').trim();
    if (id === orderId) {
      found = true;
      
      const isLocal = values[i][12] === 'Y';
      const isUS = values[i][13] === 'Y';
      const hasBio = values[i][14] === 'Y';
      const hasNonBio = values[i][15] === 'Y';
      const hasInHouse = values[i][16] === 'Y';
      
      if (hasInHouse || hasNonBio) {
        createMixedBatch_([orderId], true);
      } else if (!isUS || isLocal) {
        createPickupBatch_([orderId], true);
      } else if (isUS && hasBio && !hasNonBio && !hasInHouse) {
        createBioOnlyBatch_([orderId], true);
      }
      
      ui.alert('Success', 'Order #' + orderId + ' batched successfully.', ui.ButtonSet.OK);
      logEvent_('batch-single', '', '', 'batched', orderId, 'Manual single order batch');
      return;
    }
  }
  
  if (!found) {
    ui.alert('Error', 'Order #' + orderId + ' not found.', ui.ButtonSet.OK);
  }
}

/************************************************
 * SETUP WIZARD
 ************************************************/

function runSetupWizard() {
  const ui = SpreadsheetApp.getUi();
  
  ui.alert('Setup Wizard', 
    'This wizard will guide you through configuring the Orchestrator.\n\n' +
    'Please ensure you have:\n' +
    '1. Created Gmail labels\n' +
    '2. Configured email addresses\n' +
    '3. Set up order/tracking senders',
    ui.ButtonSet.OK);
  
  const cfg = loadConfig_();
  const sh = ensureConfigSheet_();
  
  const keys = [
    'INBOX_LABEL',
    'ORDER_LABEL',
    'TRACKING_LABEL',
    'IGNORE_LABEL',
    'ERROR_LABEL',
    'VITALITY_TO',
    'TREASURE_ADMIN',
    'TREASURE_INVENTORY_SPECIALIST',
    'ORDER_SENDERS',
    'TRACKING_SENDERS',
    'BATCH_DAYS',
    'BATCH_TIME',
    'TEST_BATCH_TO',
    'GO_LIVE'
  ];
  
  keys.forEach(key => {
    if (!cfg[key] || cfg[key] === Session.getActiveUser().getEmail()) {
      const response = ui.prompt('Configure: ' + key, 'Enter value for ' + key + ':', ui.ButtonSet.OK_CANCEL);
      if (response.getSelectedButton() === ui.Button.OK) {
        const val = response.getResponseText().trim();
        if (val) {
          sh.appendRow([key, val]);
        }
      }
    }
  });
  
  CONFIG_CACHE = null;
  
  ui.alert('Setup Complete', 'Configuration saved. Please review the Config sheet.', ui.ButtonSet.OK);
}

function installBatchTrigger(hours) {
  hours = hours || 1;
  
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'buildBatchDrafts') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  ScriptApp.newTrigger('buildBatchDrafts')
    .timeBased()
    .everyHours(hours)
    .create();
  
  Logger.log('Batch trigger installed: every ' + hours + ' hour(s)');
}



// Compatibility wrappers for older orchestration names
function createVitalityIndividualDrafts_(targetOrderId) {
  if (targetOrderId) return createBioOnlyBatch_([String(targetOrderId)], true);
  const ordersSh = ensureOrdersSheet_();
  const vals = ordersSh.getDataRange().getValues();
  const ids = [];
  for (let i = 1; i < vals.length; i++) {
    const row = vals[i];
    const id = String(row[0] || '').trim();
    if (!id) continue;
    const status = String(row[1] || '').trim();
    if (status !== 'NEW') continue;
    const isLocal = row[12] === 'Y';
    const isUS = row[13] === 'Y';
    const hasBio = row[14] === 'Y';
    const hasNonBio = row[15] === 'Y';
    const hasInHouse = row[16] === 'Y';
    if (isUS && !isLocal && hasBio && !hasNonBio && !hasInHouse) ids.push(id);
  }
  if (ids.length) createBioOnlyBatch_(ids, true);
}

function createVitalityPickupDraft_(targetOrderId) {
  if (targetOrderId) return createPickupBatch_([String(targetOrderId)], true);
  const ordersSh = ensureOrdersSheet_();
  const vals = ordersSh.getDataRange().getValues();
  const ids = [];
  for (let i = 1; i < vals.length; i++) {
    const row = vals[i];
    const id = String(row[0] || '').trim();
    if (!id) continue;
    const status = String(row[1] || '').trim();
    if (status !== 'NEW') continue;
    const isLocal = row[12] === 'Y';
    const isUS = row[13] === 'Y';
    const hasBio = row[14] === 'Y';
    const hasNonBio = row[15] === 'Y';
    const hasInHouse = row[16] === 'Y';
    if ((isLocal || !isUS) && hasBio && !hasNonBio && !hasInHouse) ids.push(id);
  }
  if (ids.length) createPickupBatch_(ids, true);
}


function sendWeeklyOpsDigestDraft() {
  const ui = SpreadsheetApp.getUi();
  try {
    const result = sendWeeklyOpsDigest_();
    ui.alert('Weekly Ops Digest', 'Draft created for ' + result.recipient + '. Subject: ' + result.subject, ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('Weekly Ops Digest Error', String(err && err.message ? err.message : err), ui.ButtonSet.OK);
    throw err;
  }
}

function sendWeeklyOpsDigest_() {
  const cfg = loadConfig_();
  const now = new Date();
  const tz = getPrimaryTimeZone_();
  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

  const ordersSh = ensureOrdersSheet_();
  const batchSh = ensureBatchHistorySheet_();

  const orderVals = ordersSh.getDataRange().getValues();
  const batchVals = batchSh.getDataRange().getValues();

  let ordersRegistered7d = 0;
  let newQueueCount = 0;
  let priorityQueueCount = 0;
  let oldestPriorityAgeHours = 0;
  let holdCount = 0;
  let oldestHoldAgeHours = 0;

  for (let i = 1; i < orderVals.length; i++) {
    const row = orderVals[i];
    const status = String(row[1] || '').trim();
    const createdTs = row[6] instanceof Date ? row[6] : null;
    const isPriority = row[17] === 'Y';
    const holdUntil = row[23] instanceof Date ? row[23] : null;

    if (createdTs && createdTs >= sevenDaysAgo && createdTs <= now) ordersRegistered7d++;

    if (status === 'NEW') {
      newQueueCount++;

      if (isPriority && (!holdUntil || holdUntil <= now)) {
        priorityQueueCount++;
        const ageHours = createdTs ? Math.max(0, Math.round(((now.getTime() - createdTs.getTime()) / 3600000) * 10) / 10) : 0;
        if (ageHours > oldestPriorityAgeHours) oldestPriorityAgeHours = ageHours;
      }
    }

    if (holdUntil && holdUntil > now) {
      holdCount++;
      const holdAgeHours = createdTs ? Math.max(0, Math.round(((now.getTime() - createdTs.getTime()) / 3600000) * 10) / 10) : 0;
      if (holdAgeHours > oldestHoldAgeHours) oldestHoldAgeHours = holdAgeHours;
    }
  }

  let batchesSent7d = 0;
  const batchesByType = {};
  for (let i = 1; i < batchVals.length; i++) {
    const ts = batchVals[i][2] instanceof Date ? batchVals[i][2] : null;
    if (!ts || ts < sevenDaysAgo || ts > now) continue;

    const batchType = String(batchVals[i][1] || 'UNKNOWN').trim() || 'UNKNOWN';
    batchesSent7d++;
    batchesByType[batchType] = (batchesByType[batchType] || 0) + 1;
  }

  const batchTypeSummary = Object.keys(batchesByType).sort().map(k => k + ': ' + batchesByType[k]).join(', ') || 'none';
  const nowStr = Utilities.formatDate(now, tz, 'yyyy-MM-dd HH:mm');
  const rangeStartStr = Utilities.formatDate(sevenDaysAgo, tz, 'yyyy-MM-dd');
  const rangeEndStr = Utilities.formatDate(now, tz, 'yyyy-MM-dd');

  const recipient = String(cfg.TREASURE_ADMIN || Session.getActiveUser().getEmail()).trim();
  const ccRaw = [cfg.TREASURE_INVENTORY_SPECIALIST, cfg.VITALITY_TO].filter(Boolean).join(',');
  const cc = ccRaw ? ccRaw : undefined;

  const subject = '[Ops Digest] Treasures Weekly Snapshot - ' + rangeEndStr;
  let body = '';
  body += 'Treasures Automation Weekly Ops Digest (Draft)\n';
  body += 'Generated: ' + nowStr + ' (' + tz + ')\n';
  body += 'Window: ' + rangeStartStr + ' to ' + rangeEndStr + '\n\n';

  body += '1) Throughput\n';
  body += '- Orders registered (7d): ' + ordersRegistered7d + '\n';
  body += '- Batches sent (7d): ' + batchesSent7d + '\n';
  body += '- Batches by type: ' + batchTypeSummary + '\n\n';

  body += '2) Queue Health (current)\n';
  body += '- NEW queue count: ' + newQueueCount + '\n';
  body += '- Priority queue count: ' + priorityQueueCount + '\n';
  body += '- Oldest priority age (hours): ' + oldestPriorityAgeHours + '\n';
  body += '- Hold count (active): ' + holdCount + '\n';
  body += '- Oldest hold age (hours): ' + oldestHoldAgeHours + '\n\n';

  body += '3) Suggested Ops Focus\n';
  if (priorityQueueCount > 0) {
    body += '- Clear priority queue first; consider manual trigger if dispatch-day gates are open.\n';
  } else if (newQueueCount > 0) {
    body += '- Queue healthy; next focus is keeping cycle consistency and reviewing mixed batch load.\n';
  } else {
    body += '- Queue clear; use this window for config hygiene and edge-case QA.\n';
  }

  GmailApp.createDraft(recipient, subject, body, cc ? { cc: cc } : {});
  logEvent_('weekly-ops-digest', '', '', 'drafted', '', 'recipient=' + recipient + '; batchesSent7d=' + batchesSent7d + '; priorityQueueCount=' + priorityQueueCount);

  return { recipient: recipient, subject: subject };
}


/************************************************
 * RESET UTILITIES
 ************************************************/

function resetSpecificOrders() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Reset Specific Orders', 'Enter order IDs (comma-separated):', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) return;
  const orderIds = response.getResponseText().split(',').map(s => s.trim()).filter(Boolean);
  if (!orderIds.length) return ui.alert('No order IDs provided');

  const sheetNames = ['Orders','OrderLines','OrderLinesEffective','Events','BatchHistory','ParserDebug'];
  let deleted = 0;
  sheetNames.forEach(name => {
    const sh = SpreadsheetApp.getActive().getSheetByName(name);
    if (!sh) return;
    const vals = sh.getDataRange().getValues();
    for (let i = vals.length - 1; i >= 1; i--) {
      const row = vals[i].map(v => String(v || ''));
      const has = orderIds.some(id => row.join(' ').indexOf(id) >= 0);
      if (has) { sh.deleteRow(i + 1); deleted++; }
    }
  });

  ui.alert('Reset Complete', 'Deleted ' + deleted + ' rows for orders: ' + orderIds.join(', '), ui.ButtonSet.OK);
}

function resetAllOrderData() {
  const ui = SpreadsheetApp.getUi();
  const ok = ui.alert('DANGER: Full Reset', 'Delete all order/event/batch/parser data (headers kept)?', ui.ButtonSet.YES_NO);
  if (ok !== ui.Button.YES) return;

  const names = ['Orders','OrderLines','OrderLinesEffective','Events','BatchHistory','InHousePackingList','StockLedger','ParserDebug'];
  let cleared = 0;

  names.forEach(name => {
    const sh = SpreadsheetApp.getActive().getSheetByName(name);
    if (!sh) return;

    const lr = sh.getLastRow();
    if (lr <= 1) return;

    const rowsToReset = lr - 1;
    try {
      // Primary path: physical row delete (keeps sheet compact)
      const frozenRows = sh.getFrozenRows() || 0;
      if (frozenRows > 1) sh.setFrozenRows(1);
      sh.deleteRows(2, rowsToReset);
    } catch (e) {
      // Fallback path: clear contents when row delete is blocked by frozen/filter state
      sh.getRange(2, 1, rowsToReset, sh.getMaxColumns()).clearContent();
    }

    cleared += rowsToReset;
  });

  ui.alert('Reset Complete', 'Reset ' + cleared + ' data rows.', ui.ButtonSet.OK);
}

function reprocessIgnoredEmails() {
  const ui = SpreadsheetApp.getUi();
  const cfg = loadConfig_();
  const L_IGN = GmailApp.getUserLabelByName(cfg.IGNORE_LABEL);
  const L_IN = GmailApp.getUserLabelByName(cfg.INBOX_LABEL);
  if (!L_IGN || !L_IN) return ui.alert('Error', 'Ignore/Inbox label missing', ui.ButtonSet.OK);
  const threads = L_IGN.getThreads();
  threads.forEach(t => { L_IN.addToThread(t); L_IGN.removeFromThread(t); });
  ui.alert('Recovery Complete', 'Moved ' + threads.length + ' threads back to Inbox. Run triage().', ui.ButtonSet.OK);
}
