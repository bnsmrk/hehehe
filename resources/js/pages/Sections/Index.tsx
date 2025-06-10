import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

type GradeLevel = {
    id: number;
    name: string;
};

type Section = {
    id: number;
    name: string;
    grade_level: GradeLevel;
};

type PageProps = {
    gradeLevels: GradeLevel[];
    sections: Section[];
};

export default function Sections() {
    const { gradeLevels, sections } = usePage<PageProps>().props;
    const { data, setData, post, processing, reset, errors } = useForm({
        grade_level_id: '',
        name: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/sections', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title="Sections" />
            <h1 className="mb-4 text-xl font-bold">Sections</h1>

            <form onSubmit={handleSubmit} className="mb-6 flex max-w-md flex-col gap-2">
                <label htmlFor="grade_level_id" className="font-semibold">
                    Select Grade Level
                </label>
                <select
                    id="grade_level_id"
                    value={data.grade_level_id}
                    onChange={(e) => setData('grade_level_id', e.target.value)}
                    className="rounded border px-2 py-1"
                    required
                >
                    <option value="">-- Select Grade Level --</option>
                    {gradeLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                            {level.name}
                        </option>
                    ))}
                </select>
                {errors.grade_level_id && <div className="text-red-500">{errors.grade_level_id}</div>}

                <label htmlFor="name" className="font-semibold">
                    Section Name
                </label>
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="rounded border px-2 py-1"
                    required
                />
                {errors.name && <div className="text-red-500">{errors.name}</div>}

                <button type="submit" disabled={processing} className="mt-2 rounded bg-blue-500 px-4 py-1 text-white">
                    Add Section
                </button>
            </form>

            <table className="min-w-full border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Section Name</th>
                        <th className="border px-4 py-2">Grade Level</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map((section) => (
                        <tr key={section.id}>
                            <td className="border px-4 py-2">{section.id}</td>
                            <td className="border px-4 py-2">{section.name}</td>
                            <td className="border px-4 py-2">{section.grade_level?.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AppLayout>
    );
}
