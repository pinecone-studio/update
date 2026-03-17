/** @format */

// 'use client';

// import { useEffect, useState } from 'react';
// import { GraphQLClient, gql } from 'graphql-request';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

// const HEALTH_QUERY = gql`
//   query {
//     health {
//       ok
//       timestamp
//     }
//     hello
//   }
// `;

// type GraphQLHealth = {
//   health: { ok: boolean; timestamp: string };
//   hello: string;
// };

// export default function Home() {
//   const [data, setData] = useState<GraphQLHealth | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const client = new GraphQLClient(`${API_URL}/graphql`);
//     client
//       .request<GraphQLHealth>(HEALTH_QUERY)
//       .then(setData)
//       .catch((err) => setError(err.message));
//   }, []);

//   return (
//     <main className="p-8 font-sans">
//       <h1 className="text-2xl font-bold">EBMS — Employee Benefits Management System</h1>
//       <p className="mt-2 text-gray-600">Pinequest S3 Ep1 Project 2026 · team-7</p>
//       <p>
//         API: <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">{API_URL}</code>
//       </p>
//       {data && (
//         <section className="mt-6 rounded-lg bg-gray-100 p-4">
//           <h2 className="text-base font-medium">GraphQL Response</h2>
//           <p>
//             <strong>health:</strong> ok={String(data.health.ok)}, time={data.health.timestamp}
//           </p>
//           <p>
//             <strong>hello:</strong> {data.hello}
//           </p>
//         </section>
//       )}
//       {error && (
//         <p className="mt-4 text-red-600">
//           GraphQL error: {error} (is Worker running at {API_URL}?)
//         </p>
//       )}
//       {!data && !error && <p className="mt-4 text-gray-500">Loading GraphQL...</p>}
//     </main>
//   );
// }
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/employee");
}
