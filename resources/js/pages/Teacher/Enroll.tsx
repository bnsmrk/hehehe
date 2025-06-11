import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

interface Section {
    id: number;
    name: string;
    grade_level_id: number;
}

interface EnrollProps {
    students: { id: number; name: string; email: string }[];
    gradeLevels: { id: number; name: string }[];
    sections: Section[];
}

export default function Enroll({ students, gradeLevels, sections }: EnrollProps) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        grade_level_id: '',
        section_id: '',
    });

    // Filter sections based on selected grade level
    const filteredSections = useMemo(
        () => (data.grade_level_id ? sections.filter((s) => String(s.grade_level_id) === String(data.grade_level_id)) : []),
        [sections, data.grade_level_id],
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/enroll');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Enroll', href: '/enroll' }]}>
            <Head title="Enroll" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto max-w-lg rounded-xl border bg-white p-8 shadow">
                    <h2 className="mb-6 text-2xl font-bold">Enroll Student</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block font-semibold">Student</label>
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                required
                            >
                                <option value="">Select student</option>
                                {students.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.email})
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && <div className="text-sm text-red-600">{errors.user_id}</div>}
                        </div>
                        <div>
                            <label className="mb-1 block font-semibold">Grade Level</label>
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={data.grade_level_id}
                                onChange={(e) => {
                                    setData('grade_level_id', e.target.value);
                                    setData('section_id', ''); // Reset section when grade changes
                                }}
                                required
                            >
                                <option value="">Select grade level</option>
                                {gradeLevels.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                            {errors.grade_level_id && <div className="text-sm text-red-600">{errors.grade_level_id}</div>}
                        </div>
                        <div>
                            <label className="mb-1 block font-semibold">Section</label>
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={data.section_id}
                                onChange={(e) => setData('section_id', e.target.value)}
                                required
                                disabled={!data.grade_level_id}
                            >
                                <option value="">Select section</option>
                                {filteredSections.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                            {errors.section_id && <div className="text-sm text-red-600">{errors.section_id}</div>}
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded bg-primary py-2 font-semibold text-white hover:bg-primary/90"
                            disabled={processing}
                        >
                            {processing ? 'Enrolling...' : 'Enroll Student'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
