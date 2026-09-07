import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, Send } from 'lucide-react';
import { weddingConfig } from '@/config/wedding.config';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { submitNaqootEntry } from '@/lib/supabase/naqoot.service';
import { buildNaqootWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp/buildWhatsAppUrl';

const CANDLE_PRESETS = [0, 20, 30, 50, 100] as const;
const MESSAGE_MAX = 200;

type NaqootFormProps = {
  onSubmitted?: () => void;
};

export function NaqootForm({ onSubmitted }: NaqootFormProps) {
  const { naqoot } = weddingConfig;
  const { copy } = naqoot;

  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState<string>(copy.amountPlaceholder);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const parsedAmount = Number(amount) || 0;

  function setAmountSafe(next: number) {
    const clamped = Math.min(naqoot.maxAmount, Math.max(naqoot.minAmount, next));
    setAmount(String(clamped));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setFeedback('');

    if (!donorName.trim()) {
      setStatus('error');
      setFeedback(copy.errorName);
      return;
    }
    if (parsedAmount < naqoot.minAmount || parsedAmount > naqoot.maxAmount) {
      setStatus('error');
      setFeedback(copy.errorAmount);
      return;
    }

    const trimmedName = donorName.trim();
    const trimmedMessage = message.trim();

    const whatsappText = buildNaqootWhatsAppMessage({
      donorName: trimmedName,
      amount: parsedAmount,
      message: trimmedMessage || undefined,
      groomNickname: weddingConfig.copy.heroInviteNickname,
      defaultMessage: copy.whatsappDefaultMessage,
    });

    const whatsappUrl = buildWhatsAppUrl(naqoot.groomWhatsApp, whatsappText);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    if (isSupabaseConfigured() && parsedAmount > 0) {
      try {
        await submitNaqootEntry({
          donorName: trimmedName,
          amount: parsedAmount,
          message: trimmedMessage || undefined,
        });
        onSubmitted?.();
      } catch {
        // WhatsApp is the primary channel; leaderboard sync is best-effort.
      }
    }

    setStatus('success');
    setFeedback(copy.success);
    setDonorName('');
    setAmount(copy.amountPlaceholder);
    setMessage('');
  }

  return (
    <motion.form
      className="naqoot-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      noValidate
    >
      <div className="naqoot-form__field">
        <label className="naqoot-form__label" htmlFor="naqoot-name">
          {copy.nameLabel}
        </label>
        <input
          id="naqoot-name"
          className="naqoot-form__input"
          type="text"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder={copy.namePlaceholder}
          maxLength={80}
          autoComplete="name"
          required
        />
      </div>

      <div className="naqoot-form__field naqoot-form__field--message">
        <div className="naqoot-form__label-row">
          <div className="naqoot-form__label-stack">
            <label className="naqoot-form__label" htmlFor="naqoot-message">
              {copy.messageLabel}
            </label>
            <span className="naqoot-form__sublabel">{copy.messageSubLabel}</span>
          </div>
          <span className="naqoot-form__counter" aria-live="polite">
            {message.length}/{MESSAGE_MAX}
          </span>
        </div>
        <textarea
          id="naqoot-message"
          className="naqoot-form__textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={copy.messagePlaceholder}
          maxLength={MESSAGE_MAX}
          rows={4}
        />
      </div>

      <div className="naqoot-form__field naqoot-form__field--amount">
        <label className="naqoot-form__label" htmlFor="naqoot-amount">
          {copy.amountLabel}
          <span className="naqoot-form__optional"> (اختياري)</span>
        </label>

        <div className="naqoot-form__presets" role="group" aria-label="اختيار سريع لعدد الشموع">
          {CANDLE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`naqoot-form__preset${parsedAmount === preset ? ' naqoot-form__preset--active' : ''}`}
              onClick={() => setAmount(String(preset))}
              aria-pressed={parsedAmount === preset}
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="naqoot-form__stepper">
          <button
            type="button"
            className="naqoot-form__stepper-btn"
            onClick={() => setAmountSafe(parsedAmount - 1)}
            disabled={parsedAmount <= naqoot.minAmount}
            aria-label="إنقاص شمعة"
          >
            <Minus size={18} strokeWidth={2} />
          </button>

          <input
            id="naqoot-amount"
            className="naqoot-form__input naqoot-form__input--amount"
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(e) => {
              const next = e.target.value;
              if (next === '') {
                setAmount('');
                return;
              }
              const value = Number(next);
              if (!Number.isNaN(value)) {
                setAmount(String(Math.min(naqoot.maxAmount, Math.max(naqoot.minAmount, value))));
              }
            }}
            min={naqoot.minAmount}
            max={naqoot.maxAmount}
          />

          <button
            type="button"
            className="naqoot-form__stepper-btn"
            onClick={() => setAmountSafe(parsedAmount + 1)}
            disabled={parsedAmount >= naqoot.maxAmount}
            aria-label="زيادة شمعة"
          >
            <Plus size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

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
        <p className={`naqoot-form__feedback naqoot-form__feedback--${status}`} role="status">
          {status === 'success' && <Heart size={16} aria-hidden />}
          {feedback}
        </p>
      )}
    </motion.form>
  );
}
