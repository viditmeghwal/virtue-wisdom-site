<?php
/* ============================================================
   Virtue & Wisdom — Contact Form Handler
   Receives POST from contact.html and emails the inquiry
   to virtuewisdomofficial@gmail.com
   ============================================================ */

// ---------- CONFIG ----------
$RECIPIENT = 'virtuewisdomofficial@gmail.com';
$DOMAIN    = 'virtuewisdom.com';
// IMPORTANT: From: must be on YOUR domain for Gmail to accept it.
// Do NOT set From: to the visitor's email — Gmail will mark it as spoofing.
$FROM_EMAIL = 'noreply@' . $DOMAIN;
$FROM_NAME  = 'Virtue & Wisdom Website';
// ----------------------------

header('Content-Type: application/json; charset=UTF-8');

// Only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

// Honeypot — silently "succeed" for bots
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

// Helper: strip CR/LF (header-injection guard) + trim
function vw_clean($v) {
    if (is_array($v)) $v = implode(', ', array_map('vw_clean', $v));
    $v = (string)$v;
    $v = str_replace(["\r", "\n", "%0a", "%0d", "%0A", "%0D"], ' ', $v);
    return trim($v);
}

// Pull + clean fields
$name     = vw_clean($_POST['name']     ?? '');
$company  = vw_clean($_POST['company']  ?? '');
$email    = vw_clean($_POST['email']    ?? '');
$phone    = vw_clean($_POST['phone']    ?? '');
$industry = vw_clean($_POST['industry'] ?? '');
$note     = trim((string)($_POST['note'] ?? ''));

$services = [];
if (isset($_POST['services'])) {
    if (is_array($_POST['services'])) {
        foreach ($_POST['services'] as $s) $services[] = vw_clean($s);
    } else {
        $services[] = vw_clean($_POST['services']);
    }
}

// Validate
$errors = [];
if ($name === '')    $errors[] = 'Name is required.';
if ($company === '') $errors[] = 'Company is required.';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email is required.';
}

if ($errors) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => implode(' ', $errors)]);
    exit;
}

// Build email
$subject = 'New project inquiry — ' . $name . ' (' . $company . ')';

$servicesList = $services ? implode(', ', $services) : '—';
$noteHtml     = nl2br(htmlspecialchars($note, ENT_QUOTES, 'UTF-8'));
$ip           = htmlspecialchars($_SERVER['REMOTE_ADDR'] ?? 'unknown', ENT_QUOTES, 'UTF-8');
$ts           = date('d M Y, H:i') . ' IST';

$body = '<!doctype html>
<html><body style="font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.55;margin:0;padding:24px;background:#f6f4ef;">
  <div style="max-width:620px;margin:0 auto;background:#fff;padding:32px;border:1px solid #e5e0d4;">
    <h2 style="margin:0 0 6px;color:#0a0a0a;font-family:Georgia,serif;font-weight:400;">New project inquiry</h2>
    <p style="margin:0 0 22px;color:#888;font-size:13px;letter-spacing:.04em;">virtuewisdom.com — contact page</p>

    <table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;font-size:14px;width:100%;">
      <tr><td style="color:#888;width:110px;border-bottom:1px solid #f0ece4;">Name</td>
          <td style="border-bottom:1px solid #f0ece4;"><strong>'.htmlspecialchars($name, ENT_QUOTES, 'UTF-8').'</strong></td></tr>
      <tr><td style="color:#888;border-bottom:1px solid #f0ece4;">Company</td>
          <td style="border-bottom:1px solid #f0ece4;">'.htmlspecialchars($company, ENT_QUOTES, 'UTF-8').'</td></tr>
      <tr><td style="color:#888;border-bottom:1px solid #f0ece4;">Email</td>
          <td style="border-bottom:1px solid #f0ece4;"><a href="mailto:'.htmlspecialchars($email, ENT_QUOTES, 'UTF-8').'" style="color:#0a0a0a;">'.htmlspecialchars($email, ENT_QUOTES, 'UTF-8').'</a></td></tr>
      <tr><td style="color:#888;border-bottom:1px solid #f0ece4;">Phone</td>
          <td style="border-bottom:1px solid #f0ece4;">'.htmlspecialchars($phone !== '' ? $phone : '—', ENT_QUOTES, 'UTF-8').'</td></tr>
      <tr><td style="color:#888;border-bottom:1px solid #f0ece4;">Services</td>
          <td style="border-bottom:1px solid #f0ece4;">'.htmlspecialchars($servicesList, ENT_QUOTES, 'UTF-8').'</td></tr>
      <tr><td style="color:#888;">Industry</td>
          <td>'.htmlspecialchars($industry !== '' ? $industry : '—', ENT_QUOTES, 'UTF-8').'</td></tr>
    </table>

    <h3 style="margin:28px 0 10px;font-family:Georgia,serif;font-weight:400;color:#0a0a0a;">Project notes</h3>
    <div style="background:#f6f4ef;padding:16px 18px;border-left:3px solid #c9b785;font-size:14px;">
      '.($noteHtml !== '' ? $noteHtml : '<em style="color:#888;">No notes provided.</em>').'
    </div>

    <p style="margin:28px 0 0;color:#aaa;font-size:11px;letter-spacing:.04em;">
      Sent '.$ts.' &middot; IP '.$ip.'
    </p>
  </div>
</body></html>';

// Headers (use \r\n line endings — required by RFC)
$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';
$headers[] = 'From: ' . $FROM_NAME . ' <' . $FROM_EMAIL . '>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Envelope sender — helps deliverability on cPanel hosts
$envelope = '-f' . $FROM_EMAIL;

$sent = @mail($RECIPIENT, $subject, $body, implode("\r\n", $headers), $envelope);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'We could not send your message right now. Please email us directly at we@virtuewisdom.com.'
    ]);
}
