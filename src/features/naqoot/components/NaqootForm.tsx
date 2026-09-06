import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send } from 'lucide-react';
import { weddingConfig } from '@/config/wedding.config';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { submitNaqootEntry } from '@/lib/supabase/naqoot.service';

type NaqootFormProps = {
  onSubmitted?: () => void;
};

export function NaqootForm({ onSubmitted }: NaqootFormProps) {
  const { naqoot } = weddingConfig;
  const { copy } = naqoot;

  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setFeedback('');

    if (!isSupabaseConfigured()) {
      setStatus('error');
      setFeedback(copy.errorSupabase);
      return;
    }

    const parsedAmount = Number(amount);
    if (!donorName.trim()) {
      setStatus('error');
      setFeedback(copy.errorName);
      return;
    }
    if (!parsedAmount || parsedAmount < naqoot.minAmount) {
      setStatus('error');
      setFeedback(copy.errorAmount);
      return;
    }

    try {
      await submitNaqootEntry({
        donorName: donorName.trim(),
        amount: parsedAmount,
        message: message.trim() || undefined,
      });
      setStatus('success');
      setFeedback(copy.success);
      setDonorName('');
      setAmount('');
      setMessage('');
      onSubmitted?.();
    } catch {
      setStatus('error');
      setFeedback(copy.errorGeneric);
    }
  }

  return (
    <motion.form
      className="naqoot-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <label>
        <span className="naqoot-form__label">{copy.nameLabel}</span>
        <input
          type="text"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder={copy.namePlaceholder}
          maxLength={80}
          required
        />
      </label>

      <label>
        <span className="naqoot-form__label">{copy.amountLabel}</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={naqoot.minAmount}
          max={naqoot.maxAmount}
          placeholder={copy.amountPlaceholder}
          required
        />
        <span className="naqoot-form__hint">{copy.amountHint}</span>
      </label>

      <label>
        <span className="naqoot-form__label">{copy.messageLabel}</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={copy.messagePlaceholder}
          maxLength={200}
          rows={4}
        />
      </label>

      <button type="submit" className="naqoot-form__submit" disabled={status === 'loading'}>
        {status === 'loading' ? (
          copy.submitLoading
        ) : (
          <>
            <Send size={18} strokeWidth={1.75} aria-hidden />
            {copy.submit}
          </>
        )}
      </button>

      {feedback && (
        <p className={`naqoot-form__feedback naqoot-form__feedback--${status}`}>
          {status === 'success' && <Heart size={16} aria-hidden />}
          {feedback}
        </p>
      )}
    </motion.form>
  );
}
