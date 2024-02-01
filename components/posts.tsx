'use client';

import { useGetPosts } from '@/data/get-posts';
import { addLike, deletePost } from '@/server/actions/create-post';
import { useAction } from 'next-safe-action/hooks';
import { AnimatePresence, motion } from 'framer-motion';

import { HeartIcon, Trash, MessageCircle, Send } from 'lucide-react';
import { CardHeaderMotion, CardMotion, CardTitle } from './ui/card';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Posts() {
	const { data: posts, error: postError } = useGetPosts();
	const { execute: executeAddLike } = useAction(addLike);
	const { execute: executeDeletePost } = useAction(deletePost);
	const { data: session } = useSession();
	if (postError) return postError.message;
	if (posts?.success)
		return (
			<CardMotion
				layout
				className='flex flex-col mt-6 p-4 font-medium shadow-md mx-auto'
			>
				<CardHeaderMotion layout>
					<CardTitle className='text-sky-600 mx-auto'>News Feed</CardTitle>
				</CardHeaderMotion>

				<AnimatePresence presenceAffectsLayout>
					{posts?.success.map((post) => (
						<motion.div
							layout
							animate={{ opacity: 1 }}
							initial={{ opacity: 0 }}
							exit={{ opacity: 0 }}
							className='mx-auto my-2 p-4 shadow-lg w-1/2 flex-shrink h-fit border-2 border-secondary rounded-md flex flex-col gap-4'
							key={post.id}
						>
							<div className='flex gap-2 items-center '>
								<Image
									src={post.author.image!}
									width={24}
									height={24}
									alt={post.author.name!}
								/>
								<h2 className='text-sm font-bold text-sky-600'>{post.author.name}</h2>

								<div className='items-center justify-center flex cursor-pointer'>...</div>
							</div>
							<p className='text-primary'>{post.content}</p>
							<div className='flex gap-2 items-center justify-between'>
								<div className='flex gap-x-4 items-center'>
									<div
										onClick={() =>
											executeAddLike({
												post_id: post.id,
												user_id: session?.user.id as string,
											})
										}
										className='flex items-center gap-1 cursor-pointer'
									>
										<HeartIcon className='w-4 text-secondary-foreground' />
										<p className='text-sm'>{post.likes.length}</p>
									</div>
									<MessageCircle className='w-4 text-secondary-foreground cursor-pointer -rotate-90' />
									<Send className='w-4 text-secondary-foreground cursor-pointer' />
								</div>
								<Trash
									onClick={() => executeDeletePost({ id: post.id })}
									className='w-4 text-red-400 cursor-pointer '
								/>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</CardMotion>
		);
}
