'use client';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { formSchema } from '@/lib/formSchema';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { createPost } from '@/server/actions/create-post';
import { useAction } from 'next-safe-action/hooks';

export default function PostForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: '',
		},
	});
	const { execute, status } = useAction(createPost, {
		onSuccess(data) {
			if (data?.error) console.log(data.error);
			if (data?.success) console.log(data.success);
		},
		onExecute(data) {
			console.log('creating post....');
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		execute(values);
		form.reset();
	}

	return (
		<main>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-4'
				>
					<FormField
						control={form.control}
						name='content'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder='Post what is in you mind'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						disabled={status === 'executing'}
						type='submit'
						className='w-full bg-sky-600 hover:bg-sky-700'
					>
						Post
					</Button>
				</form>
			</Form>
		</main>
	);
}
