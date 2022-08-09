import {
  ClientSafeProvider,
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
} from 'next-auth/react';

type PageProps = { providers: ClientSafeProvider[] };

function Login({ providers }: PageProps) {
  return (
    <div>
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <button
              onClick={() =>
                signIn(provider.id, { redirect: false, password: 'password' })
              }
            >
              Sign in with {provider.name}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Login;

export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: '/' },
    };
  }

  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken(context),
    },
  };
}
