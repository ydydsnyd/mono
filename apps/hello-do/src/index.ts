import { DurableObject } from 'cloudflare:workers';
import { Zero } from '@rocicorp/zero';
import { schema, Schema } from './schema';

export class MyDurableObject extends DurableObject {
	#z: Zero<Schema>;
	#commentIDs: Set<string> = new Set();
	#gotFirstResult = false;
	#count = 0;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		addEventListener('unhandledrejection', (e) => {
			console.log('unhandledrejection', e);
		});

		this.#z = new Zero({
			server: 'https://zero-service-accel.reflect-server.net',
			userID: 'OeVnr1y5bEM_Yg06sUFtD',
			schema,
			kvStore: 'mem',
			auth: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJPZVZucjF5NWJFTV9ZZzA2c1VGdEQiLCJpYXQiOjE3MzA1Mjg0NTUsIm5hbWUiOiJhYm9vZG1hbiIsImV4cCI6MTczMzEyMDQ1NX0.lt2EbQkmuZ_MbUgku1avCQp_c0qWx1y9TAlBWjgJajc',
		});

		console.log('issuing query', this.#count++);
		const view = this.#z.query.issue
			.related('comments', (c) => c.orderBy('created', 'desc'))
			.where('shortID', 3109)
			.one()
			.materialize();
		view.addListener((issue) => {
			if (!issue) {
				return;
			}

			console.log('issue change', issue);
			const prevComments = this.#commentIDs;
			this.#commentIDs = new Set(issue.comments.map((c) => c.id));

			if (!this.#gotFirstResult) {
				this.#gotFirstResult = true;
				console.log('Got first result, ignoring');
			}
			const latestComment = issue?.comments[0] ?? undefined;
			if (latestComment && !prevComments.has(latestComment.id)) {
				console.log('New comment added - adding reply');
				const id = Math.random().toString(32).substring(2);
				this.#commentIDs.add(id);
				const props = ['Woo! awesome 🚀', 'Great job! 👍', "That's amazing! 🎉", 'Wow! 🤯'];
				const body = props[Math.floor(Math.random() * props.length)];
				void this.#z.mutate.comment.create({
					id,
					issueID: issue.id,
					created: Date.now(),
					body,
					creatorID: this.#z.userID,
				});
			} else {
				console.log('Issue changed for some other reason, ignoring');
			}
		});
	}

	init() {
		return 'ok';
	}
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname !== '/') {
			return new Response('Not found', { status: 404 });
		}
		const id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName(new URL(request.url).pathname);
		const stub = env.MY_DURABLE_OBJECT.get(id);
		// We only get the DO to trigger it to watch the issue
		return new Response(await stub.init());
	},
} satisfies ExportedHandler<Env>;
