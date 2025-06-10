import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useRef } from 'react';

type LearningResource = {
    id: number;
    title: string;
    description: string;
    file_path: string | null;
    file_type: string | null;
};

type PageProps = {
    learningResources: LearningResource[];
};

type FormDataType = {
    title: string;
    description: string;
    file: File | null;
};

export default function LearningResources({ learningResources }: PageProps) {
    const fileInput = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, reset, errors } = useForm<FormDataType>({
        title: '',
        description: '',
        file: null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/learning-resources', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (fileInput.current) fileInput.current.value = '';
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Learning Resources" />
            <div className="container mx-auto py-8">
                <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Learning Material</CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <CardContent className="flex flex-col gap-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                    {errors.title && <div className="text-xs text-red-500">{errors.title}</div>}
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        required
                                    />
                                    {errors.description && <div className="text-xs text-red-500">{errors.description}</div>}
                                </div>
                                <div>
                                    <Label htmlFor="file">File (PDF, Word, Video, Image)</Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif"
                                        ref={fileInput}
                                        onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                    />
                                    {errors.file && <div className="text-xs text-red-500">{errors.file}</div>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={processing} className="w-full">
                                    {processing ? 'Uploading...' : 'Upload'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Learning Materials</CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-[500px] overflow-x-auto">
                            <table className="min-w-full overflow-hidden rounded-lg border">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="border px-4 py-2 text-left">Title</th>
                                        <th className="border px-4 py-2 text-left">Description</th>
                                        <th className="border px-4 py-2 text-left">File/Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {learningResources.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-4 text-center text-muted-foreground">
                                                No learning materials found.
                                            </td>
                                        </tr>
                                    )}
                                    {learningResources.map((res) => (
                                        <tr key={res.id}>
                                            <td className="border px-4 py-2">{res.title}</td>
                                            <td className="border px-4 py-2">{res.description}</td>
                                            <td className="border px-4 py-2">
                                                {res.file_path ? (
                                                    <a
                                                        href={`/storage/${res.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        Download
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
