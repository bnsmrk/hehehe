import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

type GradeLevel = {
    id: number;
    name: string;
};

type Section = {
    id: number;
    name: string;
    grade_level_id: number;
};

type Subject = {
    id: number;
    name: string;
    grade_level: GradeLevel;
    section: Section;
};

type PageProps = {
    gradeLevels: GradeLevel[];
    sections: Section[];
    subjects: Subject[];
};

export default function Subjects() {
    const { gradeLevels, sections, subjects } = usePage<PageProps>().props;
    const { data, setData, post, processing, reset, errors } = useForm({
        grade_level_id: '',
        section_id: '',
        name: '',
    });

    // Filter sections based on selected grade level
    const [filteredSections, setFilteredSections] = useState<Section[]>([]);

    useEffect(() => {
        if (data.grade_level_id) {
            setFilteredSections(sections.filter((section) => section.grade_level_id === Number(data.grade_level_id)));
        } else {
            setFilteredSections([]);
        }
        // Reset section_id if grade_level_id changes
        setData('section_id', '');
        // eslint-disable-next-line
    }, [data.grade_level_id]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/subjects', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title="Subjects" />
            <h1 className="mb-4 text-xl font-bold">Subjects</h1>

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

                <label htmlFor="section_id" className="font-semibold">
                    Select Section
                </label>
                <select
                    id="section_id"
                    value={data.section_id}
                    onChange={(e) => setData('section_id', e.target.value)}
                    className="rounded border px-2 py-1"
                    required
                    disabled={!data.grade_level_id}
                >
                    <option value="">-- Select Section --</option>
                    {filteredSections.map((section) => (
                        <option key={section.id} value={section.id}>
                            {section.name}
                        </option>
                    ))}
                </select>
                {errors.section_id && <div className="text-red-500">{errors.section_id}</div>}

                <label htmlFor="name" className="font-semibold">
                    Subject Name
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
                    Add Subject
                </button>
            </form>

            <table className="min-w-full border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Subject Name</th>
                        <th className="border px-4 py-2">Grade Level</th>
                        <th className="border px-4 py-2">Section</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject) => (
                        <tr key={subject.id}>
                            <td className="border px-4 py-2">{subject.id}</td>
                            <td className="border px-4 py-2">{subject.name}</td>
                            <td className="border px-4 py-2">{subject.grade_level?.name}</td>
                            <td className="border px-4 py-2">{subject.section?.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AppLayout>
    );
}
