'use client';

import { useEffect, useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

const HEALTH_QUERY = gql`
  query {
    health {
      ok
      timestamp
    }
    hello
  }
`;

type GraphQLHealth = {
  health: { ok: boolean; timestamp: string };
  hello: string;
};

export default function Home() {
  const [data, setData] = useState<GraphQLHealth | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = new GraphQLClient(`${API_URL}/graphql`);
    client
      .request<GraphQLHealth>(HEALTH_QUERY)
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>EBMS — Employee Benefits Management System</h1>
      <p>Pinequest S3 Ep1 Project 2026 · team-7</p>
      <p>
        API: <code>{API_URL}</code>
      </p>
      {data && (
        <section style={{ marginTop: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: 8 }}>
          <h2 style={{ fontSize: '1rem', marginTop: 0 }}>GraphQL Response</h2>
          <p>
            <strong>health:</strong> ok={String(data.health.ok)}, time={data.health.timestamp}
          </p>
          <p>
            <strong>hello:</strong> {data.hello}
          </p>
        </section>
      )}
      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          GraphQL error: {error} (is Worker running at {API_URL}?)
        </p>
      )}
      {!data && !error && <p style={{ color: '#666', marginTop: '1rem' }}>Loading GraphQL...</p>}
    </main>
  );
}
