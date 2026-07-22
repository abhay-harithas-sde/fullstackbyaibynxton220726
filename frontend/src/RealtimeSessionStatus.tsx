import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './lib/supabase';
import './realtime-session.css';

const labels:Record<string,string>={waiting:'Preparing your session',generating_question:'Creating your next question',question_ready:'Question ready',evaluating_answer:'Reviewing your answer',generating_feedback:'Preparing feedback',saving_result:'Saving your progress',completed:'Interview complete',failed:'Practice is temporarily unavailable'};
export function RealtimeSessionStatus(){const {id}=useParams();const [status,setStatus]=useState('waiting');useEffect(()=>{const client=supabase;if(!client||!id)return;const channel=client.channel(`interview-status-${id}`).on('postgres_changes',{event:'UPDATE',schema:'public',table:'interview_sessions',filter:`id=eq.${id}`},payload=>setStatus((payload.new as {processing_status?:string}).processing_status||'waiting')).subscribe();return()=>{client.removeChannel(channel)}},[id]);return <div className={`realtime-status ${status==='failed'?'status-failed':''}`} role="status"><span className="status-dot"/>{labels[status]||'Updating your practice session'}</div>}
