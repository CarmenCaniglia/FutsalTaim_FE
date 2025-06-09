function GironeTable({ group, gender, standings }) {
  return (
    <div className="mb-5">
  <h5>
    {gender === 'maschile' ? 'Maschile' : 'Femminile'} - Girone {group}
  </h5>
  <div className="table-wrapper">
    <div className="table-responsive">
      <table className="table table-bordered table-striped mb-0">
        <thead>
          <tr>
            <th>Squadra</th>
            <th>PG</th>
            <th>V</th>
            <th>N</th>
            <th>P</th>
            <th>GF</th>
            <th>GS</th>
            <th>DR</th>
            <th>Pt</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((teamStat) => (
            <tr key={teamStat.team._id}>
              <td className="col-squadra"><div className="truncate-text" title={teamStat.team.name}>
    {teamStat.team.name}
  </div></td>
              <td>{teamStat.played}</td>
              <td>{teamStat.won}</td>
              <td>{teamStat.draw}</td>
              <td>{teamStat.lost}</td>
              <td>{teamStat.gf}</td>
              <td>{teamStat.ga}</td>
              <td>{teamStat.gd}</td>
              <td>{teamStat.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
  );
}

export default GironeTable;
