import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

type FormDataType = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type PageProps = {
    flash?: {
        success?: string;
    };
};

export default function StudentRegistration() {
    const { data, setData, post, processing, errors, reset } = useForm<FormDataType>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const { props } = usePage<PageProps>();
    const success = props.flash?.success;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/student-register', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title="Student Registration" />
            <div className="flex min-h-screen items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-md rounded bg-white p-8 shadow">
                    <h2 className="mb-6 text-center text-2xl font-bold">Student Registration</h2>
                    {success && <div className="mb-4 rounded border border-green-300 bg-green-100 px-4 py-2 text-green-700">{success}</div>}
                    <div className="mb-4">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        {errors.name && <div className="text-xs text-red-500">{errors.name}</div>}
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        {errors.email && <div className="text-xs text-red-500">{errors.email}</div>}
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                        {errors.password && <div className="text-xs text-red-500">{errors.password}</div>}
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        {errors.password_confirmation && <div className="text-xs text-red-500">{errors.password_confirmation}</div>}
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Registering...' : 'Register'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
