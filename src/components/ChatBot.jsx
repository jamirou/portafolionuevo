import { useState, useRef, useEffect } from 'react';

// ─── Flow Configuration ───
const PROJECT_TYPES = [
  { id: 'landing', label: '🚀 Landing Page', desc: 'Página única de alto impacto' },
  { id: 'ecommerce', label: '🛒 Tienda Online', desc: 'E-commerce con pasarela de pago' },
  { id: 'corporate', label: '🏢 Web Corporativa', desc: 'Sitio profesional multi-página' },
  { id: 'portfolio', label: '🎨 Portafolio', desc: 'Muestra tu trabajo al mundo' },
  { id: 'webapp', label: '⚡ Aplicación Web', desc: 'Sistema o plataforma a medida' },
  { id: 'marketing', label: '📈 Marketing Digital', desc: 'SEO, Ads, Redes Sociales' },
  { id: 'redesign', label: '🔄 Rediseño Web', desc: 'Renovar tu sitio actual' },
  { id: 'other', label: '💡 Otro Proyecto', desc: 'Cuéntame tu idea' },
];

const BUDGET_RANGES = [
  { id: 'starter', label: '💰 Básico', desc: '$50.000 - $150.000 CLP' },
  { id: 'medium', label: '💎 Estándar', desc: '$150.000 - $400.000 CLP' },
  { id: 'premium', label: '🏆 Premium', desc: '$400.000 - $800.000 CLP' },
  { id: 'enterprise', label: '🚀 Empresarial', desc: '+$800.000 CLP' },
  { id: 'unsure', label: '🤔 No estoy seguro', desc: 'Necesito orientación' },
];

const TIMELINE_OPTIONS = [
  { id: 'urgent', label: '⚡ Urgente', desc: 'Menos de 1 semana' },
  { id: 'normal', label: '📅 Normal', desc: '2 a 4 semanas' },
  { id: 'relaxed', label: '🌿 Sin apuro', desc: '1 a 2 meses' },
  { id: 'flexible', label: '🔄 Flexible', desc: 'Sin fecha límite' },
];

const FEATURES = [
  { id: 'responsive', label: '📱 Diseño Responsive' },
  { id: 'seo', label: '🔍 SEO Optimizado' },
  { id: 'analytics', label: '📊 Google Analytics' },
  { id: 'payments', label: '💳 Pasarela de Pago' },
  { id: 'blog', label: '📝 Blog / Noticias' },
  { id: 'forms', label: '📋 Formularios' },
  { id: 'chat', label: '💬 Chat en vivo' },
  { id: 'social', label: '📲 Redes Sociales' },
  { id: 'animations', label: '✨ Animaciones' },
  { id: 'multilang', label: '🌐 Multi-idioma' },
];

// ─── Steps ───
const STEPS = [
  'welcome',
  'projectType',
  'projectDetails',
  'features',
  'budget',
  'timeline',
  'contactName',
  'contactEmail',
  'contactPhone',
  'contactBusiness',
  'summary',
  'sent',
];

// ─── Icons ───
const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="chatbot-icon-svg">
    <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="chatbot-icon-svg">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── Main Component ───
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    projectType: null,
    projectDetails: '',
    features: [],
    budget: null,
    timeline: null,
    name: '',
    email: '',
    phone: '',
    business: '',
  });
  const [inputValue, setInputValue] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [currentStep, isOpen]);

  // Auto-show hint after 5s
  useEffect(() => {
    const timer = setTimeout(() => setHasNewMessage(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const step = STEPS[currentStep];

  const goNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const selectProjectType = (type) => {
    setData({ ...data, projectType: type });
    goNext();
  };

  const selectBudget = (budget) => {
    setData({ ...data, budget });
    goNext();
  };

  const selectTimeline = (timeline) => {
    setData({ ...data, timeline });
    goNext();
  };

  const toggleFeature = (featureId) => {
    setData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const handleTextSubmit = (field) => {
    if (!inputValue.trim()) return;
    setData({ ...data, [field]: inputValue.trim() });
    setInputValue('');
    goNext();
  };

  const buildWhatsAppMessage = () => {
    const projectLabel = PROJECT_TYPES.find(p => p.id === data.projectType)?.label || data.projectType;
    const budgetLabel = BUDGET_RANGES.find(b => b.id === data.budget)?.label + ' ' + BUDGET_RANGES.find(b => b.id === data.budget)?.desc || data.budget;
    const timelineLabel = TIMELINE_OPTIONS.find(t => t.id === data.timeline)?.label + ' ' + TIMELINE_OPTIONS.find(t => t.id === data.timeline)?.desc || data.timeline;
    const featureLabels = data.features.map(f => FEATURES.find(ft => ft.id === f)?.label).join(', ') || 'Ninguna seleccionada';

    return encodeURIComponent(
`🤖 *NUEVA COTIZACIÓN desde el Bot*
━━━━━━━━━━━━━━━━━━━━

📋 *PROYECTO*
• Tipo: ${projectLabel}
• Detalles: ${data.projectDetails || 'No especificado'}

✨ *FUNCIONALIDADES*
${featureLabels}

💰 *PRESUPUESTO:* ${budgetLabel}
⏰ *PLAZO:* ${timelineLabel}

👤 *DATOS DEL CLIENTE*
• Nombre: ${data.name}
• Email: ${data.email}
• Teléfono: ${data.phone}
• Negocio: ${data.business || 'No especificado'}

━━━━━━━━━━━━━━━━━━━━
📍 Enviado desde jamirmkt.com`
    );
  };

  const sendToWhatsApp = () => {
    const message = buildWhatsAppMessage();
    window.open(`https://wa.me/56947185397?text=${message}`, '_blank');
    goNext();
  };

  const resetBot = () => {
    setCurrentStep(0);
    setData({
      projectType: null, projectDetails: '', features: [],
      budget: null, timeline: null, name: '', email: '', phone: '', business: '',
    });
    setInputValue('');
  };

  // ─── Render Steps ───
  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p><strong>¡Hola! 👋</strong></p>
              <p>Soy el asistente de <strong>Jamiro</strong>. Estoy aquí para ayudarte a cotizar tu proyecto web o de marketing digital.</p>
            </div>
            <div className="chatbot-bubble">
              <p>Trabajo todo tipo de proyectos: <strong>Landing Pages, Tiendas Online, Webs Corporativas, Apps Web, Marketing Digital</strong> y mucho más.</p>
            </div>
            <div className="chatbot-bubble">
              <p>¿Empezamos? Te haré unas preguntas rápidas para entender lo que necesitas 🚀</p>
            </div>
            <button className="chatbot-main-btn" onClick={goNext}>
              ¡Sí, comencemos! ✨
            </button>
          </div>
        );

      case 'projectType':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p>¿Qué tipo de proyecto necesitas? 🤔</p>
            </div>
            <div className="chatbot-options-grid">
              {PROJECT_TYPES.map(type => (
                <button
                  key={type.id}
                  className={`chatbot-option-card ${data.projectType === type.id ? 'selected' : ''}`}
                  onClick={() => selectProjectType(type.id)}
                >
                  <span className="chatbot-option-label">{type.label}</span>
                  <span className="chatbot-option-desc">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'projectDetails':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p>¡Excelente elección! ✅</p>
              <p>Cuéntame más sobre tu proyecto. ¿Qué necesitas específicamente? ¿Algún detalle importante?</p>
            </div>
            <div className="chatbot-input-group">
              <textarea
                className="chatbot-textarea"
                placeholder="Ej: Necesito una tienda para vender ropa con filtros por talla y color..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSubmit('projectDetails'); }}}
                rows={3}
              />
              <button className="chatbot-send-btn" onClick={() => handleTextSubmit('projectDetails')}>
                <SendIcon />
              </button>
            </div>
            <button className="chatbot-skip-btn" onClick={() => { setData({...data, projectDetails: ''}); goNext(); }}>
              Saltar por ahora →
            </button>
          </div>
        );

      case 'features':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p>¿Qué funcionalidades te interesan? Selecciona las que apliquen 👇</p>
            </div>
            <div className="chatbot-features-grid">
              {FEATURES.map(feature => (
                <button
                  key={feature.id}
                  className={`chatbot-feature-chip ${data.features.includes(feature.id) ? 'selected' : ''}`}
                  onClick={() => toggleFeature(feature.id)}
                >
                  {feature.label}
                </button>
              ))}
            </div>
            <button className="chatbot-main-btn" onClick={goNext} style={{ marginTop: '12px' }}>
              Continuar →
            </button>
          </div>
        );

      case 'budget':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p>💰 ¿Cuál es tu presupuesto aproximado?</p>
              <p style={{ fontSize: '12px', opacity: 0.7 }}>No te preocupes, esto es solo una referencia. Siempre busco la mejor solución para tu bolsillo.</p>
            </div>
            <div className="chatbot-options-list">
              {BUDGET_RANGES.map(budget => (
                <button
                  key={budget.id}
                  className={`chatbot-option-card horizontal ${data.budget === budget.id ? 'selected' : ''}`}
                  onClick={() => selectBudget(budget.id)}
                >
                  <span className="chatbot-option-label">{budget.label}</span>
                  <span className="chatbot-option-desc">{budget.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p>⏰ ¿Para cuándo necesitas el proyecto?</p>
            </div>
            <div className="chatbot-options-list">
              {TIMELINE_OPTIONS.map(tl => (
                <button
                  key={tl.id}
                  className={`chatbot-option-card horizontal ${data.timeline === tl.id ? 'selected' : ''}`}
                  onClick={() => selectTimeline(tl.id)}
                >
                  <span className="chatbot-option-label">{tl.label}</span>
                  <span className="chatbot-option-desc">{tl.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'contactName':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p>¡Ya casi terminamos! 🎉</p>
              <p>Ahora necesito tus datos para contactarte. ¿Cuál es tu nombre?</p>
            </div>
            <div className="chatbot-input-group">
              <input
                type="text"
                className="chatbot-input"
                placeholder="Tu nombre completo"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit('name'); }}
                autoFocus
              />
              <button className="chatbot-send-btn" onClick={() => handleTextSubmit('name')}>
                <SendIcon />
              </button>
            </div>
          </div>
        );

      case 'contactEmail':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p>Gracias, <strong>{data.name}</strong> 😊</p>
              <p>¿Cuál es tu correo electrónico?</p>
            </div>
            <div className="chatbot-input-group">
              <input
                type="email"
                className="chatbot-input"
                placeholder="tu@email.com"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit('email'); }}
                autoFocus
              />
              <button className="chatbot-send-btn" onClick={() => handleTextSubmit('email')}>
                <SendIcon />
              </button>
            </div>
          </div>
        );

      case 'contactPhone':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p>📱 ¿Tu número de teléfono? (con código de país)</p>
            </div>
            <div className="chatbot-input-group">
              <input
                type="tel"
                className="chatbot-input"
                placeholder="+56 9 1234 5678"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit('phone'); }}
                autoFocus
              />
              <button className="chatbot-send-btn" onClick={() => handleTextSubmit('phone')}>
                <SendIcon />
              </button>
            </div>
          </div>
        );

      case 'contactBusiness':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p>🏢 ¿Nombre de tu empresa o negocio? (opcional)</p>
            </div>
            <div className="chatbot-input-group">
              <input
                type="text"
                className="chatbot-input"
                placeholder="Mi Empresa SpA"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit('business'); }}
                autoFocus
              />
              <button className="chatbot-send-btn" onClick={() => handleTextSubmit('business')}>
                <SendIcon />
              </button>
            </div>
            <button className="chatbot-skip-btn" onClick={() => { setData({...data, business: ''}); goNext(); }}>
              Saltar →
            </button>
          </div>
        );

      case 'summary':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p>🎯 <strong>¡Resumen de tu cotización!</strong></p>
            </div>
            <div className="chatbot-summary">
              <div className="chatbot-summary-item">
                <span className="chatbot-summary-label">Proyecto</span>
                <span className="chatbot-summary-value">{PROJECT_TYPES.find(p => p.id === data.projectType)?.label}</span>
              </div>
              {data.projectDetails && (
                <div className="chatbot-summary-item">
                  <span className="chatbot-summary-label">Detalles</span>
                  <span className="chatbot-summary-value">{data.projectDetails}</span>
                </div>
              )}
              {data.features.length > 0 && (
                <div className="chatbot-summary-item">
                  <span className="chatbot-summary-label">Funcionalidades</span>
                  <span className="chatbot-summary-value">{data.features.map(f => FEATURES.find(ft => ft.id === f)?.label).join(', ')}</span>
                </div>
              )}
              <div className="chatbot-summary-item">
                <span className="chatbot-summary-label">Presupuesto</span>
                <span className="chatbot-summary-value">{BUDGET_RANGES.find(b => b.id === data.budget)?.desc}</span>
              </div>
              <div className="chatbot-summary-item">
                <span className="chatbot-summary-label">Plazo</span>
                <span className="chatbot-summary-value">{TIMELINE_OPTIONS.find(t => t.id === data.timeline)?.desc}</span>
              </div>
              <div className="chatbot-summary-divider" />
              <div className="chatbot-summary-item">
                <span className="chatbot-summary-label">Nombre</span>
                <span className="chatbot-summary-value">{data.name}</span>
              </div>
              <div className="chatbot-summary-item">
                <span className="chatbot-summary-label">Email</span>
                <span className="chatbot-summary-value">{data.email}</span>
              </div>
              <div className="chatbot-summary-item">
                <span className="chatbot-summary-label">Teléfono</span>
                <span className="chatbot-summary-value">{data.phone}</span>
              </div>
              {data.business && (
                <div className="chatbot-summary-item">
                  <span className="chatbot-summary-label">Negocio</span>
                  <span className="chatbot-summary-value">{data.business}</span>
                </div>
              )}
            </div>
            <button className="chatbot-whatsapp-btn" onClick={sendToWhatsApp}>
              <WhatsAppIcon /> Enviar por WhatsApp
            </button>
          </div>
        );

      case 'sent':
        return (
          <div className="chatbot-step chatbot-fade-in">
            <div className="chatbot-bubble">
              <p>✅ <strong>¡Listo!</strong></p>
              <p>Tu cotización se envió por WhatsApp. Me pondré en contacto contigo lo antes posible.</p>
              <p>¡Gracias por confiar en mí, <strong>{data.name}</strong>! 🙌</p>
            </div>
            <button className="chatbot-main-btn" onClick={resetBot}>
              🔄 Hacer otra cotización
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercent = Math.round((currentStep / (STEPS.length - 1)) * 100);

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''} ${hasNewMessage && !isOpen ? 'has-notification' : ''}`}
        onClick={() => { setIsOpen(!isOpen); setHasNewMessage(false); }}
        aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente de cotización'}
      >
        {isOpen ? <CloseIcon /> : <BotIcon />}
        {hasNewMessage && !isOpen && <span className="chatbot-notification-dot" />}
      </button>

      {/* Tooltip */}
      {!isOpen && hasNewMessage && (
        <div className="chatbot-tooltip chatbot-fade-in" onClick={() => { setIsOpen(true); setHasNewMessage(false); }}>
          ¿Necesitas una cotización? 💬
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window chatbot-slide-up">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <h3 className="chatbot-header-title">Asistente Jamiro</h3>
                <span className="chatbot-header-status">
                  <span className="chatbot-status-dot" /> En línea
                </span>
              </div>
            </div>
            {currentStep > 0 && currentStep < STEPS.length - 1 && (
              <button className="chatbot-back-btn" onClick={goBack} aria-label="Volver atrás">
                <BackIcon />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {currentStep > 0 && currentStep < STEPS.length - 1 && (
            <div className="chatbot-progress">
              <div className="chatbot-progress-bar" style={{ width: `${progressPercent}%` }} />
              <span className="chatbot-progress-text">Paso {currentStep} de {STEPS.length - 2}</span>
            </div>
          )}

          {/* Body */}
          <div className="chatbot-body" ref={chatBodyRef}>
            {renderStep()}
          </div>
        </div>
      )}
    </>
  );
}
