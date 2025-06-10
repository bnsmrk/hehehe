import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Grade Level',
        href: '/grade-levels',
    },
];

type GradeLevel = {
    id: number;
    name: string;
};

type PageProps = {
    gradeLevels: GradeLevel[];
};

export default function GradeLevel() {
    const { data, setData, post, processing, reset, errors } = useForm({ name: '' });
    const { gradeLevels } = usePage<PageProps>().props;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/grade-levels', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="grade-levels" />
            <h1>Grade Level</h1>

            <form onSubmit={handleSubmit} className="mb-6">
                <label htmlFor="name" className="mb-2 block font-semibold">
                    Add Grade Level
                </label>
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mr-2 rounded border px-2 py-1"
                    required
                />
                <button type="submit" disabled={processing} className="rounded bg-blue-500 px-4 py-1 text-white">
                    Add
                </button>
                {errors.name && <div className="mt-1 text-red-500">{errors.name}</div>}
            </form>

            <table className="min-w-full border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Grade Level</th>
                    </tr>
                </thead>
                <tbody>
                    {gradeLevels.map((grade) => (
                        <tr key={grade.id}>
                            <td className="border px-4 py-2">{grade.id}</td>
                            <td className="border px-4 py-2">{grade.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AppLayout>
    );
}
