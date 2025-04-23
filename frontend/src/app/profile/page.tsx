import users from '../../../testdata/users.json';

const user = JSON.parse(
  JSON.stringify(users.find((user) => user.userID === '1'))
);

export default function ProfilePage() {
  return (
    <div>
      <h1>Profile</h1>
      <pre>{user.Name}</pre>
    </div>
  );
}
