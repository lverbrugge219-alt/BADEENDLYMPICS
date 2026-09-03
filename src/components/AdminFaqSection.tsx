import React, { useState, useEffect } from 'react';
import { PageRoute, FaqItem } from '../types';
import {
  getStoredFaqs,
  saveFaq,
  updateFaq,
  deleteFaq,
  reorderFaqs,
  resetFaqsToDefault,
} from '../utils/storage';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  ExternalLink,
  Search,
  CheckCircle2,
  X,
  AlertTriangle,
  Eye,
  Tag,
  Layers,
} from 'lucide-react';

interface AdminFaqSectionProps {
  onNavigate: (page: PageRoute) => void;
  showToast: (msg: string) => void;
}

const DEFAULT_CATEGORIES = [
  'Algemeen',
  'Deelname',
  'Jury',
  'Spelregels',
  'Kosten',
  'Prijzen',
  'Organisatie',
  'Bezoekers',
];

export const AdminFaqSection: React.FC<AdminFaqSectionProps> = ({ onNavigate, showToast }) => {
  const [faqs, setFaqs] = useState<FaqItem[]>(() => getStoredFaqs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Form modal states
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  // Form fields
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('Algemeen');
  const [customCategory, setCustomCategory] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation modals
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const handleDataChange = () => {
      setFaqs(getStoredFaqs());
    };
    window.addEventListener('badeendlympics_data_change', handleDataChange);
    return () => window.removeEventListener('badeendlympics_data_change', handleDataChange);
  }, []);

  // Compute available categories from faqs
  const availableCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...faqs.map((f) => f.category).filter(Boolean) as string[]])
  );

  // Filtered FAQ list
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.category && faq.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingFaq(null);
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('Algemeen');
    setCustomCategory('');
    setFormOrder(faqs.length + 1);
    setFormError(null);
    setIsAddingFaq(true);
  };

  const openEditModal = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    if (DEFAULT_CATEGORIES.includes(faq.category || '')) {
      setFormCategory(faq.category || 'Algemeen');
      setCustomCategory('');
    } else {
      setFormCategory('Custom');
      setCustomCategory(faq.category || '');
    }
    setFormOrder(faq.order ?? 1);
    setFormError(null);
    setIsAddingFaq(true);
  };

  const closeFormModal = () => {
    setIsAddingFaq(false);
    setEditingFaq(null);
    setFormError(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuestion = formQuestion.trim();
    const cleanAnswer = formAnswer.trim();

    if (!cleanQuestion) {
      setFormError('Vul a.u.b. een vraag in.');
      return;
    }
    if (!cleanAnswer) {
      setFormError('Vul a.u.b. een antwoord in.');
      return;
    }
    if (cleanQuestion.length > 300) {
      setFormError('De vraag mag maximaal 300 tekens bevatten.');
      return;
    }
    if (cleanAnswer.length > 2000) {
      setFormError('Het antwoord mag maximaal 2000 tekens bevatten.');
      return;
    }

    const finalCategory =
      formCategory === 'Custom' ? customCategory.trim() || 'Algemeen' : formCategory;

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingFaq) {
        await updateFaq(editingFaq.id, {
          question: cleanQuestion,
          answer: cleanAnswer,
          category: finalCategory,
          order: formOrder,
        });
        showToast('Vraag succesvol bijgewerkt');
      } else {
        await saveFaq({
          question: cleanQuestion,
          answer: cleanAnswer,
          category: finalCategory,
          order: formOrder,
        });
        showToast('Nieuwe vraag succesvol toegevoegd');
      }
      closeFormModal();
    } catch {
      setFormError('Opslaan is mislukt. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!faqToDelete) return;
    deleteFaq(faqToDelete.id);
    showToast(`Vraag "${faqToDelete.question.slice(0, 30)}..." verwijderd`);
    setFaqToDelete(null);
  };

  const handleConfirmReset = async () => {
    setIsSubmitting(true);
    try {
      await resetFaqsToDefault();
      showToast('Standaard veelgestelde vragen hersteld');
      setShowResetModal(false);
    } catch {
      showToast('Herstellen mislukt. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    const newItems = [...faqs];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    await reorderFaqs(newItems);
    showToast('Volgorde bijgewerkt');
  };

  const handleMoveDown = async (index: number) => {
    if (index >= faqs.length - 1) return;
    const newItems = [...faqs];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    await reorderFaqs(newItems);
    showToast('Volgorde bijgewerkt');
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 bg-amber-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-amber-400 border-2 border-black flex items-center justify-center font-black shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <HelpCircle size={22} className="text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-lg uppercase text-black leading-none">
                VEELGESTELDE VRAGEN (FAQ) BEHEER
              </h3>
              <span className="px-2 py-0.5 bg-black text-amber-400 text-[10px] font-black uppercase tracking-wider">
                {faqs.length} {faqs.length === 1 ? 'VRAAG' : 'VRAGEN'}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium mt-1">
              Beheer en organiseer de vragen en antwoorden die zichtbaar zijn op de openbare Praktische Info pagina.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => onNavigate('info')}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            title="Bekijk de openbare pagina met alle vragen"
          >
            <ExternalLink size={14} />
            <span>BEKIJK OP INFO PAGINA</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-rose-700 flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            title="Herstel de 7 officiële standaardvragen"
          >
            <RotateCcw size={14} />
            <span>HERSTEL STANDAARD</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            <Plus size={16} />
            <span>NIEUWE VRAAG TOEVOEGEN</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek in vragen, antwoorden of categorieën..."
              className="w-full pl-9 pr-8 py-2 border-2 border-black text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-amber-50/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
            {filteredFaqs.length} van {faqs.length} getoond
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-black uppercase text-slate-500 mr-1 flex items-center gap-1">
            <Tag size={12} /> Categorie:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 text-[11px] font-display font-black uppercase tracking-wider border border-black cursor-pointer transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-black text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            ALLE ({faqs.length})
          </button>
          {availableCategories.map((cat) => {
            const count = faqs.filter((f) => f.category === cat).length;
            if (count === 0 && selectedCategory !== cat) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-display font-black uppercase tracking-wider border border-black cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ List */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <HelpCircle size={40} className="mx-auto text-slate-300 mb-3" />
          <h4 className="font-display font-black text-lg uppercase text-black">
            Geen vragen gevonden
          </h4>
          <p className="text-xs text-slate-600 font-semibold max-w-sm mx-auto mt-1 mb-4">
            Er zijn geen veelgestelde vragen die overeenkomen met je zoekopdracht of geselecteerde categorie.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 bg-amber-400 border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-amber-300"
          >
            + Vraag Toevoegen
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const originalIndex = faqs.findIndex((f) => f.id === faq.id);
            const isFirst = originalIndex === 0;
            const isLast = originalIndex === faqs.length - 1;

            return (
              <div
                key={faq.id}
                className="bg-white border-2 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:border-slate-800"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Content Column */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-6 h-6 bg-black text-amber-400 text-[11px] font-black border border-black flex items-center justify-center shrink-0">
                        #{faq.order ?? originalIndex + 1}
                      </span>
                      {faq.category && (
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                          {faq.category}
                        </span>
                      )}
                      {faq.updatedAt && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          Gewijzigd: {new Date(faq.updatedAt).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-black text-base sm:text-lg uppercase text-black tracking-tight">
                      {faq.question}
                    </h3>

                    <div className="bg-slate-50 border border-slate-200 p-3.5 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed rounded-none whitespace-pre-line">
                      {faq.answer}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center lg:flex-col gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 justify-end">
                    {/* Order buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(originalIndex)}
                        disabled={isFirst}
                        title="Verplaats omhoog"
                        className="w-8 h-8 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed border-2 border-black flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(originalIndex)}
                        disabled={isLast}
                        title="Verplaats omlaag"
                        className="w-8 h-8 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed border-2 border-black flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => openEditModal(faq)}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 border-2 border-black font-display font-black text-[11px] uppercase tracking-wider text-black flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <Edit2 size={12} />
                      <span>BEWERK</span>
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => setFaqToDelete(faq)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border-2 border-black font-display font-black text-[11px] uppercase tracking-wider text-rose-700 flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <Trash2 size={12} />
                      <span>VERWIJDER</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* -------------------- ADD / EDIT MODAL -------------------- */}
      {isAddingFaq && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-2xl w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 border-2 border-black flex items-center justify-center font-black">
                  {editingFaq ? <Edit2 size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black">
                    {editingFaq ? 'VRAAG BEWERKEN' : 'NIEUWE VRAAG TOEVOEGEN'}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {editingFaq ? `Vraag ID: ${editingFaq.id}` : 'Voeg een veelgestelde vraag toe aan de infopagina'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-slate-100 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <X size={16} />
              </button>
            </div>

            {formError && (
              <div className="mb-5 p-3 bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-5">
              {/* Question */}
              <div>
                <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-1.5">
                  VRAAG <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={300}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Bijv. Wie kan er meedoen aan de BADEENDLYMPICS?"
                  className="w-full px-3.5 py-2.5 border-2 border-black text-sm font-semibold focus:outline-none focus:bg-amber-50"
                />
                <div className="text-[11px] text-slate-500 text-right mt-1">
                  {formQuestion.length} / 300 tekens
                </div>
              </div>

              {/* Answer */}
              <div>
                <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-1.5">
                  ANTWOORD <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={2000}
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Schrijf hier een duidelijk en behulpzaam antwoord..."
                  className="w-full px-3.5 py-2.5 border-2 border-black text-sm font-medium focus:outline-none focus:bg-amber-50"
                />
                <div className="text-[11px] text-slate-500 text-right mt-1">
                  {formAnswer.length} / 2000 tekens
                </div>
              </div>

              {/* Category & Order in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-1.5">
                    CATEGORIE
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-black text-sm font-semibold bg-white focus:outline-none"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Custom">+ Eigen categorie typen...</option>
                  </select>

                  {formCategory === 'Custom' && (
                    <input
                      type="text"
                      placeholder="Vul categorie naam in..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full mt-2 px-3.5 py-2 border-2 border-black text-xs font-semibold focus:outline-none focus:bg-amber-50"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-1.5">
                    VOLGORDE / POSITIE
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={formOrder}
                    onChange={(e) => setFormOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 border-2 border-black text-sm font-semibold focus:outline-none focus:bg-amber-50"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Lager getal verschijnt bovenaan op de infopagina
                  </span>
                </div>
              </div>

              {/* Live Preview Box */}
              {(formQuestion || formAnswer) && (
                <div className="border-2 border-dashed border-slate-300 p-4 bg-slate-50">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-slate-500 mb-2">
                    <Eye size={12} /> Live Voorbeeld:
                  </div>
                  <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-slate-100 border border-black text-slate-700">
                        {formCategory === 'Custom' ? customCategory || 'Eigen' : formCategory}
                      </span>
                      <h4 className="font-display font-black text-sm uppercase text-black">
                        {formQuestion || 'Je vraag hier...'}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-700 font-medium whitespace-pre-line">
                      {formAnswer || 'Je antwoord hier...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-black">
                <button
                  type="button"
                  onClick={closeFormModal}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 border-2 border-black font-display font-black text-xs uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  ANNULEREN
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <CheckCircle2 size={16} />
                  <span>{isSubmitting ? 'OPSLAAN...' : editingFaq ? 'WIJZIGINGEN OPSLAAN' : 'VRAAG OPSLAAN'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- DELETE CONFIRM MODAL -------------------- */}
      {faqToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 border-2 border-black flex items-center justify-center font-black mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="font-display font-black text-xl uppercase tracking-tight text-black mb-2">
              VRAAG VERWIJDEREN?
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-4">
              Weet je zeker dat je deze veelgestelde vraag wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
            </p>

            <div className="bg-slate-50 border-2 border-black p-3.5 mb-6 text-xs font-bold text-slate-800">
              "{faqToDelete.question}"
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFaqToDelete(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border-2 border-black font-display font-black text-xs uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                ANNULEREN
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Trash2 size={14} />
                <span>JA, VERWIJDEREN</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- RESET TO DEFAULT CONFIRM MODAL -------------------- */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 border-2 border-black flex items-center justify-center font-black mb-4">
              <RotateCcw size={24} />
            </div>
            <h3 className="font-display font-black text-xl uppercase tracking-tight text-black mb-2">
              STANDAARD VRAGEN HERSTELLEN?
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-4">
              Hiermee worden eventuele aangepaste vragen overschreven en gereset naar de officiële 7 standaardvragen van de BADEENDLYMPICS 2027.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-white hover:bg-slate-100 border-2 border-black font-display font-black text-xs uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                ANNULEREN
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={isSubmitting}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <RotateCcw size={14} />
                <span>{isSubmitting ? 'HERSTELLEN...' : 'JA, HERSTEL STANDAARD'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
