import React, { useEffect, useRef, useState } from 'react';
import { BUY_URL, STEPS, VIDEO_URL } from './quizData.js';

const LOGO = '/img/livro-frigo-pronto.webp';
const LOADING_STEPS = [
  'Analizziamo le tue risposte…',
  'Scegliamo i pasti adatti a te…',
  'Prepariamo il tuo piano…',
  'Prepariamo il messaggio della Chef Luana…',
];

function CheckIcon({ strokeWidth = '3.2' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function ImageIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-8 9" /></svg>;
}

function Header({ index, phase, onBack }) {
  const quiz = phase === 'quiz';
  return <header className="top">
    <div className="top-in">
      <div className="brandrow">
        <div className="logo">
          <img src={LOGO} alt="Libro del Metodo Frigo Pronto" width="260" height="241" loading="eager" decoding="async" />
          <span>Frigo <em>Pronto</em></span>
        </div>
        <button className="back" id="back" type="button" aria-label="Indietro" hidden={!quiz || index === 0} onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
      </div>
      <div className="progress" id="progress" hidden={!quiz}>
        <div className="bars" id="bars">{STEPS.map((step, k) => <i key={step.id} className={k < index ? 'on' : k === index ? 'now' : ''} />)}</div>
      </div>
    </div>
  </header>;
}

function Hero({ step }) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showImage, setShowImage] = useState(true);
  return <div className="art">
    <div className="ph" hidden={!showPlaceholder}>
      <span aria-hidden="true"><ImageIcon /></span><b>Immagine 1</b><span>{step.artNote}</span>
    </div>
    <img src={step.art} alt="" hidden={!showImage} loading="eager" decoding="async" fetchPriority="high" onLoad={() => setShowPlaceholder(false)} onError={() => setShowImage(false)} />
  </div>;
}

function Section({ children, live = false, className = '', ariaHidden }) {
  return <section className={`screen${className ? ` ${className}` : ''}`} aria-live={live ? 'polite' : undefined} aria-hidden={ariaHidden}>{children}</section>;
}

function firstName(value) {
  const word = value.trim().split(/\s+/)[0] || '';
  return word.charAt(0).toLocaleUpperCase('it-IT') + word.slice(1).toLocaleLowerCase('it-IT');
}

function getOrigin() {
  try {
    const saved = sessionStorage.getItem('gp_o');
    if (saved) return saved;
  } catch { /* storage can be unavailable */ }
  const ref = document.referrer || '';
  const origin = /cakto/.test(ref) ? 'compra' : /appcozinhaperfeita47|lovable\.app/.test(ref) ? 'recusa' : 'outro';
  try { sessionStorage.setItem('gp_o', origin); } catch { /* storage can be unavailable */ }
  return origin;
}

const ORIGIN = getOrigin();
function count(stage) {
  if (window.location.protocol === 'file:') return;
  try {
    if (sessionStorage.getItem(`gp_e_${stage}`)) return;
    sessionStorage.setItem(`gp_e_${stage}`, '1');
  } catch { /* storage can be unavailable */ }
  const url = `/e?e=${stage}&o=${ORIGIN}`;
  try { if (navigator.sendBeacon?.(url)) return; } catch { /* use fetch below */ }
  try { fetch(url, { method: 'POST', keepalive: true }); } catch { /* keep the quiz usable */ }
}

function Quiz({ index, name, fullName, setFullName, answers, onName, onOption }) {
  const step = STEPS[index];
  const busy = useRef(false);
  useEffect(() => { busy.current = false; }, [index]);

  return <Section live>
    {index === 0 && <Hero step={step} />}
    <div className="q"><h1>{step.question(name)}</h1></div>
    {step.type === 'text' ? <>
      <form id="f" className="field" noValidate onSubmit={(event) => { event.preventDefault(); if (firstName(fullName).length >= 2) onName(fullName); }}>
        <input id="nome" name="nome" type="text" aria-label="Il tuo nome e cognome" autoComplete="name" maxLength="60" placeholder="Nome e cognome" value={fullName} onChange={(event) => setFullName(event.target.value)} />
        <button className="btn pulse" id="go" type="submit" disabled={firstName(fullName).length < 2}>Inizia <ArrowIcon /></button>
      </form>
      <div className="trust"><span><CheckIcon />Crea il tuo piano con sole 7 domande</span></div>
    </> : <div className="opts" role="radiogroup">
      {step.options.map(([label], k) => {
        const selected = answers[step.id] === k;
        return <button key={label} type="button" className={`opt${selected ? ' sel' : ''}`} role="radio" aria-checked={selected} data-k={k} onClick={() => {
          if (busy.current) return;
          busy.current = true;
          onOption(step.id, k);
        }}>
          <span className="k">{'ABCDE'.charAt(k)}</span><span className="t">{label}</span><span className="c"><CheckIcon /></span>
        </button>;
      })}
    </div>}
  </Section>;
}

function Loading({ name, onDone, playerLoaded }) {
  const [progress, setProgress] = useState(0);
  const playerLoadedRef = useRef(playerLoaded);
  const onDoneRef = useRef(onDone);
  playerLoadedRef.current = playerLoaded;
  onDoneRef.current = onDone;
  useEffect(() => {
    const start = performance.now();
    let frameId;
    let endTimer;
    let finishing = false;
    function animate(now) {
      const elapsed = now - start;
      const minimumDuration = 3200;
      const maximumDuration = 9000;
      const p = Math.min(0.94, (elapsed / minimumDuration) * 0.94);
      if (!finishing && elapsed >= minimumDuration && (playerLoadedRef.current || elapsed >= maximumDuration)) {
        finishing = true;
        setProgress(1);
        endTimer = setTimeout(() => onDoneRef.current(), 400);
        return;
      }
      setProgress(p);
      frameId = requestAnimationFrame(animate);
    }
    frameId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frameId); clearTimeout(endTimer); };
  }, []);
  const circumference = 2 * Math.PI * 56;
  return <Section className="loading-screen">
    <div className="load">
      <span className="load-eyebrow">Il tuo piano personalizzato</span>
      <div className="ring"><svg viewBox="0 0 132 132">
        <circle cx="66" cy="66" r="56" stroke="#eef6f0" strokeWidth="11" fill="none" />
        <circle id="arc" cx="66" cy="66" r="56" stroke="#ea580c" strokeWidth="11" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} />
      </svg><div className="pct" id="pct">{Math.round(progress * 100)}%</div></div>
      <h1 style={{ fontSize: 21 }}>{name}, stiamo preparando il tuo piano</h1>
      <p className="load-sub">Ancora un momento e sarà tutto pronto.</p>
      <ul className="steps" id="lsteps">{LOADING_STEPS.map((label, k) => <li key={label} className={progress >= (k + 1) / 4 ? 'ok' : progress >= k / 4 ? 'go' : ''}><span className="d"><CheckIcon /></span><span>{label}</span></li>)}</ul>
    </div>
  </Section>;
}

function Result({ name, active, onPlayerLoad }) {
  const [showButtons, setShowButtons] = useState(false);
  const iframeRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    count('video');
    // The iframe has already loaded during the progress screen. Start from the beginning on reveal.
    const frame = requestAnimationFrame(() => {
      iframeRef.current?.contentWindow?.postMessage({ type: 'currentTime', parameter: 0 }, '*');
      iframeRef.current?.contentWindow?.postMessage({ type: 'play' }, '*');
    });
    const timer = setTimeout(() => { setShowButtons(true); count('botoes'); }, 30000);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, [active]);
  const search = window.location.search || '';
  return <Section className={active ? '' : 'result-preload'} ariaHidden={!active}>
    <div className="q"><h1 className="ready">{name}, il tuo piano personalizzato è pronto.</h1><p className="sub">Prima, però, guarda questo messaggio della Chef Luana per te.</p></div>
    <div className="video" id="vsl"><iframe ref={iframeRef} id="panda-d22e8f74-5111-4cb3-92c7-cd110a759446" src={VIDEO_URL} allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture" allowFullScreen loading="eager" fetchPriority="high" title="Messaggio della Chef Luana" onLoad={onPlayerLoad} /></div>
    <a className="btn pulse" id="buy" href={`${BUY_URL}${search}`} hidden={!showButtons} onClick={() => count('comprar')}>Acquista Frigo Pronto <ArrowIcon /></a>
  </Section>;
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('quiz');
  const [fullName, setFullName] = useState('');
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState({});
  const [playerLoaded, setPlayerLoaded] = useState(false);

  useEffect(() => {
    try {
      const wiapySell = new URLSearchParams(window.location.search).get('wiapy_sell');
      if (wiapySell) localStorage.setItem('gp_wiapy_sell', wiapySell);
    } catch { /* storage can be unavailable */ }
    count('entrou');
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [index, phase]);

  function next() {
    count(`p${index + 1}`);
    if (index < STEPS.length - 1) setIndex(index + 1);
    else setPhase('loading');
  }

  function onName(value) {
    const normalized = value.trim().replace(/\s+/g, ' ');
    setFullName(normalized);
    setName(firstName(normalized));
    document.activeElement?.blur();
    next();
  }

  function onOption(id, value) {
    setAnswers((current) => ({ ...current, [id]: value }));
    setTimeout(next, 220);
  }

  return <>
    <Header index={index} phase={phase} onBack={() => { if (index > 0) setIndex(index - 1); }} />
    <main id="app" key={phase === 'quiz' ? `quiz-${index}` : 'after-quiz'}>
      {phase === 'quiz' ? <Quiz index={index} name={name} fullName={fullName} setFullName={setFullName} answers={answers} onName={onName} onOption={onOption} /> : <>
        {phase === 'loading' && <Loading name={name} onDone={() => setPhase('result')} playerLoaded={playerLoaded} />}
        <Result name={name} active={phase === 'result'} onPlayerLoad={() => setPlayerLoaded(true)} />
      </>}
    </main>
  </>;
}
