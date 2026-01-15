export default function SubSiteTable({ subSites = [] }) {
  if (!subSites.length) return <p>No sub-sites</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Sub-Site ID</th>
        </tr>
      </thead>
      <tbody>
        {subSites.map(id => (
          <tr key={id}>
            <td>{id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}