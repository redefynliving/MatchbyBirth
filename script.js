function zodiacSign(date){
  if(!date) return null;
  const d=new Date(date); const m=d.getUTCMonth()+1; const day=d.getUTCDate();
  const ranges=[['capricorn',1,1,1,19],['aquarius',1,20,2,18],['pisces',2,19,3,20],['aries',3,21,4,19],['taurus',4,20,5,20],['gemini',5,21,6,20],['cancer',6,21,7,22],['leo',7,23,8,22],['virgo',8,23,9,22],['libra',9,23,10,22],['scorpio',10,23,11,21],['sagittarius',11,22,12,21],['capricorn2',12,22,12,31]];
  for(const r of ranges){
    const [name,m1,d1,m2,d2]=r;
    if((m===m1 && day>=d1) || (m===m2 && day<=d2)) return name.replace('2','');
  }
  return null;
}

function scoreCompatibility(sign1,sign2){
  if(!sign1||!sign2) return 0;
  if(sign1===sign2) return 90+Math.floor(Math.random()*9);
  const table={'fire':['aries','leo','sagittarius'],'earth':['taurus','virgo','capricorn'],'air':['gemini','libra','aquarius'],'water':['cancer','scorpio','pisces']};
  function group(s){for(const g in table) if(table[g].includes(s)) return g; return null}
  const g1=group(sign1), g2=group(sign2);
  if(g1===g2) return 70+Math.floor(Math.random()*20);
  const combos={'fire-air':80,'air-fire':80,'earth-water':80,'water-earth':80,'fire-earth':40,'earth-fire':40,'air-water':40,'water-air':40,'fire-water':30,'water-fire':30,'air-earth':30,'earth-air':30};
  const key=g1+'-'+g2; return (combos[key]||50)+Math.floor(Math.random()*15)-7;
}

function explain(score){
  if(score>85) return 'Very compatible — lots of natural understanding.';
  if(score>70) return 'Good compatibility — worth exploring.';
  if(score>50) return 'Mixed signals — communication will matter.';
  return 'Challenging match — different approaches to life.';
}

function drawCard(name1,name2,score,sign1,sign2){
  const c=document.getElementById('card'); const ctx=c.getContext('2d');
  ctx.fillStyle='#071026'; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='#ffd166'; ctx.font='28px Inter, Arial'; ctx.fillText('MatchByBirth',20,40);
  ctx.fillStyle='#e6eef8'; ctx.font='22px Inter'; ctx.fillText(`${name1||sign1||'Person 1'}  ❤️  ${name2||sign2||'Person 2'}`,20,100);
  ctx.font='60px Inter'; ctx.fillStyle='#ffd166'; ctx.fillText(score+"%",20,200);
  ctx.font='18px Inter'; ctx.fillStyle='#9aa4b2'; ctx.fillText(explain(score),20,260);
  return c.toDataURL('image/png');
}

document.getElementById('calcBtn').addEventListener('click',()=>{
  const d1=document.getElementById('date1').value; const d2=document.getElementById('date2').value;
  const n1=document.getElementById('name1').value; const n2=document.getElementById('name2').value;
  const s1=zodiacSign(d1); const s2=zodiacSign(d2);
  if(!s1||!s2){alert('Enter both birth dates');return}
  const score=scoreCompatibility(s1,s2);
  document.getElementById('score').innerText=score+'%'; document.getElementById('explain').innerText=explain(score);
  document.getElementById('result').classList.remove('hidden');
  const data=drawCard(n1,n2,score,s1,s2);
  const dl=document.getElementById('downloadBtn'); dl.href=data; dl.classList.remove('hidden');
});

document.getElementById('shareBtn').addEventListener('click',()=>{document.getElementById('downloadBtn').click()});
