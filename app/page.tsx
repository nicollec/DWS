'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ArrowLeft, ArrowRight, X, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import articles from './articles.json';

type Article = typeof articles[number];

function Reader({ article, close }: { article: Article | null; close: () => void }) {
  const [page, setPage] = useState(0);
  const [single, setSingle] = useState(false);
  const [turn, setTurn] = useState(0);
  const [contents, setContents] = useState(false);
  const touch = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const query = matchMedia('(max-width: 800px)');
    const update = () => { setSingle(query.matches); setPage(0); };
    update(); query.addEventListener('change', update);
    return () => { query.removeEventListener('change', update); if (timer.current) clearTimeout(timer.current); };
  }, []);
  useEffect(() => { if (timer.current) clearTimeout(timer.current); setPage(0); setTurn(0); setContents(false); }, [article]);
  const total = article ? article.pages.length + 2 : 0;
  const step = single ? 1 : 2;
  const next = page + step < total;
  function move(direction: number) {
    if (turn || (direction < 0 && page === 0) || (direction > 0 && !next)) return;
    setTurn(direction);
    timer.current = setTimeout(() => { setPage(p => Math.max(0, Math.min(total - 1, p + direction * step))); setTurn(0); }, 480);
  }
  function leaf(index: number) {
    if (!article) return null;
    if (index >= total) return <div className="end-page"><span className="small">Dead Women Society</span></div>;
    if (index === 0) return <div className="cover-inner"><span className="small">Dead Women Society / Collected essays</span><img src={article.image} alt=""/><h2>{article.title}</h2><span className="small">Nicole · {article.date}</span></div>;
    if (index > article.pages.length) return <div className="end-page"><span className="small">The work remains.</span><h2>Keep digging.</h2>{article.sources && <><h3>Sources</h3><p>{article.sources}</p></>}<p className="image-credit">{article.credit}</p><button className="ink-button" onClick={close}>Back to the collection <ArrowUpRight size={18}/></button></div>;
    const marker = article.pages[index - 1][0].match(/^\[\[figure:(\d+)\]\]$/);
    const figure = marker ? article.figures[Number(marker[1])] : null;
    return <><div className="page-running"><span>Dead Women Society</span><span>Nicole</span></div>{figure ? <figure className="book-figure"><a href={figure.src} target="_blank" rel="noreferrer" aria-label="Open original image at full size"><img src={figure.src} alt={figure.caption}/></a><figcaption>{figure.caption}</figcaption></figure> : <div className="page-prose">{article.pages[index - 1].map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>}<span className="page-number">{index}</span></>;
  }
  return <Dialog open={!!article} onOpenChange={open => { if (!open) close(); }}><DialogContent className="reader" showCloseButton={false} onKeyDown={event => { if (event.target instanceof HTMLButtonElement || event.target === event.currentTarget) { if (event.key === 'ArrowRight') {event.preventDefault(); move(1);} if (event.key === 'ArrowLeft') {event.preventDefault(); move(-1);} } }}>
    <div className="reader-top"><button onClick={() => setContents(!contents)} aria-expanded={contents}><BookOpen size={18}/> Contents</button><DialogTitle className="reader-title">{article?.title}</DialogTitle><button onClick={close} aria-label="Close book"><X size={22}/></button></div>
    <DialogDescription className="sr-only">Read the complete essay. Turn pages with the corner, navigation buttons, arrow keys or a horizontal swipe.</DialogDescription>
    {contents && <div className="contents-panel"><h2>Inside this essay</h2><button onClick={() => {setPage(0);setContents(false);}}>Cover</button>{article?.pages.map((paragraphs, i) => { const match=paragraphs[0].match(/^\[\[figure:(\d+)\]\]$/); const label=match ? `Image: ${article.figures[Number(match[1])].caption}` : paragraphs[0]; return <button key={i} onClick={() => {setPage(single ? i+1 : Math.floor((i+1)/2)*2);setContents(false);}}><span>{i+1}</span>{label.slice(0,85)}…</button>; })}<button onClick={() => {setPage(single ? total-1 : Math.floor((total-1)/2)*2);setContents(false);}}>Endnotes & sources</button></div>}
    <div className="book-stage" onTouchStart={e => {touch.current=e.touches[0].clientX;}} onTouchEnd={e => {if(touch.current!==null){const delta=e.changedTouches[0].clientX-touch.current;if(Math.abs(delta)>65)move(delta<0?1:-1);touch.current=null;}}}>
      <div className="book-spread" key={article?.slug}>
        <section className={`leaf left-leaf ${page===0?'cover-leaf':''}`} key={`left-${page}`}>{leaf(page)}</section>
        {!single && <section className="leaf right-leaf" key={`right-${page}`}>{leaf(page+1)}</section>}
        {turn !== 0 && <div className={`turning-leaf ${turn<0?'backward':''}`} aria-hidden="true"><div className="turn-ink">{article?.title}<span>Dead Women Society</span></div></div>}
        {next && <button className="page-corner" aria-label="Turn to the next page" onClick={()=>move(1)}><span/></button>}
      </div>
    </div>
    <div className="reader-bottom"><button onClick={()=>move(-1)} disabled={page===0 || !!turn}><ArrowLeft size={19}/><span>Previous</span></button><div className="reading-position"><span aria-live="polite">{page===0?'Cover':`Page ${page}`} — {Math.min(page+step-1,total-1)} / {total-1}</span><div className="progress-track"><i style={{width:`${Math.min(100,(page+step)/total*100)}%`}}/></div></div><button onClick={()=>move(1)} disabled={!next || !!turn}><span>Next page</span><ArrowRight size={19}/></button></div>
  </DialogContent></Dialog>;
}

export default function Home() {
  const [selected, setSelected] = useState<Article | null>(null);
  return <main id="top">
    <header className="site-header"><a href="#top" className="wordmark" aria-label="Dead Women Society home">DWS</a><span className="header-note">An independent feminist publication</span><nav aria-label="Main navigation"><a href="#stories">The stories</a><a href="#society">The society <ArrowUpRight size={14}/></a></nav></header>
    <section className="hero" aria-label="Dead Women Society">
      <div className="hero-label"><span className="live-dot"/> THE WOMEN ARE GONE. THEIR WORK ISN’T.</div>
      <h1 className="sr-only">Dead Women Society</h1><img className="hero-logo" src="/dead-women-society-logo.png" alt="Dead Women Society"/>
      <div className="hero-foot"><span className="volume-label">History. With the women<br/>put back in.</span><p>They built. They wrote. They refused.<br/><em>We’re still digging.</em></p><a href="#stories" className="explore">Open the archive <span><ArrowDown size={22}/></span></a></div>
    </section>
    <section className="collection" id="stories"><div className="section-head"><span className="small">The collection / 01—04</span><h2>Lives that refuse<br/>to stay <em>closed.</em></h2><p>Four essays by Nicole.<br/>Open a cover. Follow the argument.</p></div>
      <div className="editorial-grid">{articles.map((article,i)=><button key={article.slug} onClick={()=>setSelected(article)} className={`story-card story-${i}`} aria-label={`Read ${article.title}`}><div className="story-image"><img src={article.image} alt={article.slug==='sisterage'?'Sarah Orne Jewett':article.title.split(' and ')[0]}/><span className="image-index">0{i+1}</span><span className="open-book"><BookOpen size={17}/> Open the story</span></div><div className="story-copy"><span className="small">{article.category}</span><h3>{article.title}</h3><p>{article.deck}</p><div className="story-meta"><span>Nicole · {article.date}</span><ArrowUpRight size={22}/></div></div></button>)}</div>
    </section>
    <section className="argument"><span className="small">From the collection / Mary Wollstonecraft</span><blockquote>“She saw women<br/>get married<br/>and <em>disappear.</em>”</blockquote><button onClick={()=>setSelected(articles[0])}>Read the essay <ArrowUpRight size={22}/></button><span className="argument-number" aria-hidden="true">1792<br/>2026</span></section>
    <section className="society" id="society"><div><span className="small">Why we dig</span><h2>An excavation.<br/><em>And an argument.</em></h2></div><div className="society-prose"><p>“We look at one woman, or one group of women, who built something, wrote something, invented something, lived something, and had it taken from her, hidden from the world or mocked for.”</p><span className="small">Nicole / Digging out Sisterage</span><p className="society-note">The institutions change. The questions keep returning. Who gets an education? Who owns the work? Who can afford to leave? And what happens when women build a life on their own terms?</p><a href="#stories">Meet the women <ArrowUpRight size={18}/></a></div></section>
    <footer><a className="wordmark" href="#top">DWS</a><p>The women in these stories are gone. Their work isn’t.</p><a href="#top">Back to the surface ↑</a></footer>
    <Reader article={selected} close={()=>setSelected(null)}/>
  </main>;
}
