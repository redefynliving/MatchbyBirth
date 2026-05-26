
export function generateResultPermalink(p1_date, p2_date, p1_name, p2_name, score, explanation) {
  // Generate the URL parameter format
  const searchParams = new URLSearchParams();
  if (p1_date) searchParams.set('p1', p1_date);
  if (p1_name) searchParams.set('p1_dob', p1_date);
  if (p2_date) searchParams.set('p2', p2_date);
  if (p2_name) searchParams.set('p2_dob', p2_date);
  
  const resultUrl = `${window.location.origin}/result?${searchParams.toString()}`;
  
  // Push to browser history
  window.history.pushState({ path: resultUrl }, '', `/result?${searchParams.toString()}`);
  
  // Update document title
  const newTitle = `${p1_name || 'Person 1'} & ${p2_name || 'Person 2'} Compatibility - ${score}% | Match by Birth`;
  document.title = newTitle;
  
  // Update meta tags dynamically
  const metaUpdates = {
    'og:title': newTitle,
    'twitter:title': newTitle,
    'description': `Compatibility score: ${score}%. ${explanation}`,
    'og:description': `Compatibility score: ${score}%. ${explanation}`,
    'twitter:description': `Compatibility score: ${score}%. ${explanation}`,
    'og:url': resultUrl
  };

  Object.entries(metaUpdates).forEach(([name, content]) => {
    let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
    if (el) {
      el.setAttribute('content', content);
    }
  });

  return resultUrl;
}

export function shareResult(platform, url, text) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  let shareLink = '';

  switch (platform) {
    case 'twitter':
      shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      break;
    case 'whatsapp':
      shareLink = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
      break;
    case 'facebook':
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
      break;
    case 'pinterest':
      shareLink = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`;
      break;
    case 'tiktok':
      // TikTok doesn't have a direct web share intent for custom text, fallback to generic action
      alert('To share on TikTok, please copy the result and paste it into a new video or message!');
      return;
    default:
      if (navigator.share) {
        navigator.share({ title: 'Match by Birth', text, url }).catch(console.error);
        return;
      }
      break;
  }

  if (shareLink) {
    window.open(shareLink, '_blank', 'width=600,height=400,noopener,noreferrer');
  }
}

export function copyResult(text, url) {
  const fullText = `${text}\n\nSee full result: ${url}`;
  navigator.clipboard.writeText(fullText).then(() => {
    // A simple browser alert for confirmation if sonner/toast is not wired directly inside this vanilla JS file.
    // In React context, we typically use toast, but keeping it vanilla as requested.
    console.log('Result copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}
