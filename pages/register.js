import React from 'react';
import { withRouter } from 'next/Router';
import { withRedux } from '../utils/withRedux';
import { isAuthenticated } from '../utils/authentication';
import RegisterPage from '../src/components/register/pages/RegisterPage';

// Route back to home page if already authenticated
export async function getServerSideProps({ params, req, res, query }) {
	let user = await isAuthenticated(req, res);
	if (user) {
		res.writeHead(200, { Location: '/' });
		res.end();
	}
	return {
		props: {},
	};
}

const Register = () => {
	return (
		<div>
			<RegisterPage />
		</div>
	);
};

export default withRedux(withRouter(Register));
