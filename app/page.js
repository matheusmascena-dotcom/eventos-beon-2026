import { createClient } from '@supabase/supabase-js';

const images = {
  'One Life': 'https://media.betimelapse.com.br/uploads/2026/05/1779302100069_One_Life_SP_2026_-_Capa_Timelapse.jpg',
  'Music On': 'https://api.wegoout.com.br/images/events/642/full_music-on-sp.webp',
  'Crochestra': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREHeNVMidXoiwj9uvvhUIu8g8hf2E4Zck8u8Rg0EA7nHSjPLA3TSD6ypjA&s=10',
  'Adriatique X': 'https://kraken.ingresse.com/event/posters/91444/large/1773685318.8785126.jpg',
  'The Grid: Outworld': 'https://media.betimelapse.com.br/uploads/2026/05/1779991359288_The_Grid_Outworld_Klangkuenstler_2026_-_Capa_Timelapse.jpg',
  'The Grid: Unreal': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG-KJTFGlUei_pam-GZK5zQY6b3nESvqBc0yO_RWEGQ7fZ_T5ciWCouW6B&s=10'
};

async function getEvents() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  const supabase = createClient(url, key);
  const { data } = await supabase.from('events').select('*').eq('published', true).order('event_date', { ascending: true });
  return data ?? [];
}

export default async function Home() {
  const events = await getEvents();
  return <main style={{maxWidth:1100,margin:'0 auto',padding:'32px 20px',fontFamily:'Arial,sans-serif'}}>
    <header style={{marginBottom:28}}><h1 style={{fontSize:36,marginBottom:8}}>Eventos BeOn - 2026</h1><p style={{color:'#666'}}>Catálogo de eventos</p></header>
    <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
      {events.map((event) => { const key = Object.keys(images).find(k => event.name?.toLowerCase().includes(k.toLowerCase().replace('the grid: ','')) || k.toLowerCase().includes(event.name?.toLowerCase())); const image = key ? images[key] : event.image_url; return <article key={event.id} style={{border:'1px solid #ddd',borderRadius:16,overflow:'hidden',background:'#fff'}}>
        {image && <img src={image} alt={event.name} style={{width:'100%',height:240,objectFit:'cover',display:'block'}} />}
        <div style={{padding:18}}><h2 style={{margin:'0 0 8px'}}>{event.name}</h2><p style={{margin:'0 0 6px'}}>{event.event_date ? new Date(event.event_date+'T00:00:00').toLocaleDateString('pt-BR') : ''}</p><p style={{color:'#666'}}>{event.location || ''}</p>{event.purchase_url && <a href={event.purchase_url} target="_blank" rel="noreferrer" style={{display:'inline-block',marginTop:10}}>Comprar ingressos</a>}</div>
      </article> })}
    </section>
    {events.length === 0 && <p>Nenhum evento publicado encontrado.</p>}
  </main>;
}