import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Image as ImageIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Exam',
        href: '/exams',
    },
];

type QuestionType = 'multiple_choice' | 'checkboxes' | 'true_false' | 'essay';

interface Question {
    id: number;
    text: string;
    type: QuestionType;
    options: string[];
    answerKey?: number | number[];
    points: number;
    image?: string; // base64 or url
}

export default function ExamBuilder() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Form states
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionType, setNewQuestionType] = useState<QuestionType>('multiple_choice');
    const [newOptions, setNewOptions] = useState(['', '']);
    const [answerKey, setAnswerKey] = useState<number | number[] | undefined>(undefined);
    const [points, setPoints] = useState<number>(1);
    const [showAnswerKey, setShowAnswerKey] = useState(false);
    const [image, setImage] = useState<string | undefined>(undefined);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setNewQuestionText('');
        setNewQuestionType('multiple_choice');
        setNewOptions(['', '']);
        setAnswerKey(undefined);
        setPoints(1);
        setEditingIndex(null);
        setShowAnswerKey(false);
        setImage(undefined);
    };

    const openAddForm = () => {
        resetForm();
        setShowForm(true);
    };

    const openEditForm = (q: Question, idx: number) => {
        setNewQuestionText(q.text);
        setNewQuestionType(q.type);
        setNewOptions(q.options.length ? q.options : ['', '']);
        setAnswerKey(q.answerKey);
        setPoints(q.points);
        setEditingIndex(idx);
        setShowForm(true);
        setShowAnswerKey(false);
        setImage(q.image);
    };

    const handleSave = () => {
        const question: Question = {
            id: editingIndex !== null ? questions[editingIndex].id : Date.now(),
            text: newQuestionText,
            type: newQuestionType,
            options: newQuestionType === 'essay' || newQuestionType === 'true_false' ? [] : newOptions.filter((opt) => opt.trim() !== ''),
            answerKey:
                newQuestionType === 'multiple_choice' || newQuestionType === 'checkboxes' || newQuestionType === 'true_false' ? answerKey : undefined,
            points,
            image,
        };

        if (editingIndex !== null) {
            // Edit mode
            const updated = [...questions];
            updated[editingIndex] = question;
            setQuestions(updated);
        } else {
            // Add mode
            setQuestions([...questions, question]);
        }
        resetForm();
        setShowForm(false);
    };

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...newOptions];
        updatedOptions[index] = value;
        setNewOptions(updatedOptions);
    };

    const addOptionField = (e: React.MouseEvent) => {
        e.preventDefault();
        setNewOptions([...newOptions, '']);
    };

    const removeOptionField = (index: number) => {
        if (newOptions.length <= 2) return; // Prevent removing if only 2 left
        setNewOptions(newOptions.filter((_, i) => i !== index));
        // Also update answerKey if needed
        if (typeof answerKey === 'number') {
            if (answerKey === index) setAnswerKey(undefined);
            else if (answerKey > index) setAnswerKey(answerKey - 1);
        }
        if (Array.isArray(answerKey)) {
            setAnswerKey(answerKey.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
        }
    };

    const deleteQuestion = (id: number) => {
        setQuestions(questions.filter((q) => q.id !== id));
        if (editingIndex !== null) resetForm();
    };

    // For checkboxes, toggle index in answerKey array
    const toggleCheckboxAnswerKey = (idx: number) => {
        if (!Array.isArray(answerKey)) setAnswerKey([idx]);
        else if (answerKey.includes(idx)) setAnswerKey(answerKey.filter((i) => i !== idx));
        else setAnswerKey([...answerKey, idx]);
    };

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setImage(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => setImage(undefined);

    // Helper: use textarea for long questions
    const renderQuestionInput = () => {
        if (newQuestionText.length > 60) {
            return (
                <Textarea
                    placeholder="Question text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="text-base"
                    rows={3}
                />
            );
        }
        return (
            <Input
                type="text"
                placeholder="Question text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                className="text-base"
            />
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exam" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-gradient-to-br from-slate-50 to-slate-200 p-4 dark:from-neutral-900 dark:to-neutral-800">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-white/80 shadow-lg md:min-h-min dark:border-sidebar-border dark:bg-neutral-900/80">
                    <div className="mx-auto max-w-3xl p-8 font-sans">
                        <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-primary drop-shadow-lg">Quiz Builder</h1>

                        <div className="mb-8 flex justify-center">
                            <Button className="mb-0 px-6 py-2 text-lg font-semibold shadow transition hover:scale-105" onClick={openAddForm}>
                                ➕ Add Question
                            </Button>
                        </div>

                        {showForm && (
                            <div className="mb-10 rounded-xl border bg-muted/60 p-8 shadow-lg animate-in fade-in">
                                {/* Inline row: Question, Image Icon, Type */}
                                <div className="mb-4 flex items-center gap-6">
                                    <div className="flex-1">{renderQuestionInput()}</div>
                                    <div className="flex flex-col items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="mb-1"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Upload Image"
                                        >
                                            <ImageIcon size={28} />
                                        </Button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    <div className="w-56">
                                        <Select
                                            value={newQuestionType}
                                            onValueChange={(value) => {
                                                setNewQuestionType(value as QuestionType);
                                                setAnswerKey(undefined);
                                                setShowAnswerKey(false);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                                <SelectItem value="checkboxes">Checkboxes</SelectItem>
                                                <SelectItem value="true_false">True / False</SelectItem>
                                                <SelectItem value="essay">Essay / Fill in the Blank</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {/* Uploaded image preview below */}
                                {image && (
                                    <div className="mb-4 flex flex-col items-center">
                                        <img
                                            src={image}
                                            alt="Question"
                                            className="h-64 w-full max-w-2xl rounded border object-contain"
                                            style={{ background: '#f8fafc' }}
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            className="mt-2 text-red-500"
                                            onClick={removeImage}
                                            title="Remove image"
                                        >
                                            Remove Image
                                        </Button>
                                    </div>
                                )}

                                {(newQuestionType === 'multiple_choice' || newQuestionType === 'checkboxes') && (
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-semibold">Options:</label>
                                        {newOptions.map((opt, index) => (
                                            <div key={index} className="mb-2 flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder={`Option ${index + 1}`}
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                    className="flex-1"
                                                />
                                                {newOptions.length > 2 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:bg-red-100"
                                                        onClick={() => removeOptionField(index)}
                                                        title="Remove option"
                                                    >
                                                        <span className="text-lg">✖</span>
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button variant="secondary" size="sm" className="mt-1" onClick={addOptionField}>
                                            ➕ Add Option
                                        </Button>
                                        <Button
                                            variant={showAnswerKey ? 'default' : 'outline'}
                                            size="sm"
                                            className="mt-1 ml-2"
                                            onClick={() => setShowAnswerKey((v) => !v)}
                                        >
                                            🗝️ Answer Key
                                        </Button>
                                        {showAnswerKey && (
                                            <div className="mt-3 rounded border bg-muted/40 p-3">
                                                <div className="mb-2 text-sm font-semibold text-primary">
                                                    Select correct answer{newQuestionType === 'checkboxes' ? 's' : ''}:
                                                </div>
                                                {newOptions.map((opt, index) => (
                                                    <label key={index} className="mb-2 flex items-center gap-2">
                                                        {newQuestionType === 'multiple_choice' ? (
                                                            <input
                                                                type="radio"
                                                                name="answerKey"
                                                                checked={answerKey === index}
                                                                onChange={() => setAnswerKey(index)}
                                                                className="accent-primary"
                                                            />
                                                        ) : (
                                                            <input
                                                                type="checkbox"
                                                                checked={Array.isArray(answerKey) && answerKey.includes(index)}
                                                                onChange={() => toggleCheckboxAnswerKey(index)}
                                                                className="accent-primary"
                                                            />
                                                        )}
                                                        <span>{opt || <span className="text-gray-400 italic">Option {index + 1}</span>}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {newQuestionType === 'true_false' && (
                                    <div className="mb-4">
                                        <Button
                                            variant={showAnswerKey ? 'default' : 'outline'}
                                            size="sm"
                                            className="mb-2"
                                            onClick={() => setShowAnswerKey((v) => !v)}
                                        >
                                            🗝️ Answer Key
                                        </Button>
                                        {showAnswerKey && (
                                            <div className="mt-3 rounded border bg-muted/40 p-3">
                                                <div className="mb-2 text-sm font-semibold text-primary">Select correct answer:</div>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="tf-answer"
                                                            checked={answerKey === 0}
                                                            onChange={() => setAnswerKey(0)}
                                                            className="accent-primary"
                                                        />
                                                        True
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="tf-answer"
                                                            checked={answerKey === 1}
                                                            onChange={() => setAnswerKey(1)}
                                                            className="accent-primary"
                                                        />
                                                        False
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Points input for all question types */}
                                <div className="mb-4 flex items-center gap-2">
                                    <label className="block text-sm font-semibold">Points:</label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={points}
                                        onChange={(e) => setPoints(Number(e.target.value))}
                                        className="w-24"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button className="mt-4 w-full text-base font-semibold" onClick={handleSave}>
                                        {editingIndex !== null ? '💾 Update Question' : '✅ Save Question'}
                                    </Button>
                                    <Button
                                        className="mt-4 w-full text-base font-semibold"
                                        variant="secondary"
                                        onClick={() => {
                                            resetForm();
                                            setShowForm(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="mb-5 text-2xl font-bold text-primary/90">Preview Quiz Form</h2>

                            {questions.length === 0 && (
                                <div className="rounded-lg bg-muted/60 p-6 text-center text-gray-500 italic shadow">
                                    No questions yet. Click Add Question!
                                </div>
                            )}

                            <div className="space-y-8">
                                {questions.map((q, index) => (
                                    <div
                                        key={q.id}
                                        className="rounded-xl border bg-white/90 p-8 shadow transition hover:shadow-lg dark:bg-neutral-900/80"
                                    >
                                        {/* Inline row: Question, Image Icon, Type */}
                                        <div className="mb-4 flex items-center gap-6">
                                            <div className="flex flex-1 items-center gap-2 text-lg font-semibold">
                                                {q.text.length > 60 ? (
                                                    <Textarea
                                                        value={q.text}
                                                        readOnly
                                                        className="min-h-[40px] resize-none border-none bg-transparent p-0"
                                                    />
                                                ) : (
                                                    q.text
                                                )}
                                            </div>
                                            <div className="flex min-w-[70px] flex-col items-center justify-center">
                                                <span className="text-gray-400">
                                                    <ImageIcon size={32} />
                                                </span>
                                            </div>
                                            <div className="w-40 text-right text-xs font-semibold text-primary">
                                                {q.type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </div>
                                        </div>
                                        {/* Uploaded image preview below */}
                                        {q.image && (
                                            <div className="mb-4 flex flex-col items-center">
                                                <img
                                                    src={q.image}
                                                    alt="Question"
                                                    className="h-64 w-full max-w-2xl rounded border object-contain"
                                                    style={{ background: '#f8fafc' }}
                                                />
                                            </div>
                                        )}
                                        <div className="mb-2 flex items-center gap-4 text-sm text-gray-500">
                                            <span>Points: {q.points}</span>
                                            {(q.type === 'multiple_choice' || q.type === 'checkboxes') && (
                                                <span>
                                                    Answer Key:{' '}
                                                    {Array.isArray(q.answerKey) ? (
                                                        q.answerKey.map((i) => q.options[i]).join(', ')
                                                    ) : typeof q.answerKey === 'number' ? (
                                                        q.options[q.answerKey]
                                                    ) : (
                                                        <span className="text-red-500 italic">Not set</span>
                                                    )}
                                                </span>
                                            )}
                                            {q.type === 'true_false' && (
                                                <span>
                                                    Answer Key:{' '}
                                                    {typeof q.answerKey === 'number' ? (
                                                        q.answerKey === 0 ? (
                                                            'True'
                                                        ) : (
                                                            'False'
                                                        )
                                                    ) : (
                                                        <span className="text-red-500 italic">Not set</span>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        {q.type === 'multiple_choice' &&
                                            q.options.map((opt: string, i: number) => (
                                                <div key={i} className="mb-2">
                                                    <label className="flex items-center gap-2 text-base">
                                                        <input
                                                            type="radio"
                                                            name={`q-${index}`}
                                                            className="accent-primary"
                                                            checked={q.answerKey === i}
                                                            readOnly
                                                        />{' '}
                                                        {opt}
                                                    </label>
                                                </div>
                                            ))}

                                        {q.type === 'checkboxes' &&
                                            q.options.map((opt: string, i: number) => (
                                                <div key={i} className="mb-2">
                                                    <label className="flex items-center gap-2 text-base">
                                                        <input
                                                            type="checkbox"
                                                            className="accent-primary"
                                                            checked={Array.isArray(q.answerKey) && q.answerKey.includes(i)}
                                                            readOnly
                                                        />{' '}
                                                        {opt}
                                                    </label>
                                                </div>
                                            ))}

                                        {q.type === 'true_false' && (
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-base">
                                                    <input
                                                        type="radio"
                                                        name={`q-${index}`}
                                                        className="accent-primary"
                                                        checked={q.answerKey === 0}
                                                        readOnly
                                                    />{' '}
                                                    True
                                                </label>
                                                <label className="flex items-center gap-2 text-base">
                                                    <input
                                                        type="radio"
                                                        name={`q-${index}`}
                                                        className="accent-primary"
                                                        checked={q.answerKey === 1}
                                                        readOnly
                                                    />{' '}
                                                    False
                                                </label>
                                            </div>
                                        )}

                                        {q.type === 'essay' && (
                                            <Textarea placeholder="Your answer..." readOnly className="mt-2 min-h-[80px] resize-none bg-muted/40" />
                                        )}

                                        <div className="mt-4 flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditForm(q, index)} title="Edit question">
                                                ✏️ Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="ml-2"
                                                onClick={() => deleteQuestion(q.id)}
                                                title="Delete question"
                                            >
                                                <span className="text-lg">❌</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
