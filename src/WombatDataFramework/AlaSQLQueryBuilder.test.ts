import AlaSQLQueryBuilder, {aggregateExpr, arithmeticExpr, basicExpr, column, constantExpr, renameExpr} from './AlaSQLQueryBuilder';
import {format} from 'sql-formatter';

describe('AlaSQLQueryBuilder', () => {
  let builder: AlaSQLQueryBuilder;

  beforeEach(() => {
    builder = new AlaSQLQueryBuilder();
  });

  test('Select one column from one node', () => {
    const expectedQuery = format('SELECT A.col1 FROM ? AS A');
    const query = builder
      .setSource('A')
      .select([basicExpr(column('A', 'col1'))])
      .build();
    expect(query).toEqual(expectedQuery);
  });

  test('Select multiple columns from one node', () => {
    const expectedQuery = format('SELECT A.col1, A.col2 FROM ? AS A');
    const query = builder
      .setSource('A')
      .select([basicExpr(column('A', 'col1')), basicExpr(column('A', 'col2'))])
      .build();
    expect(query).toEqual(expectedQuery);
  });

  test('Select with a join', () => {
    const expectedQuery = format('SELECT A.col1, B.col2 FROM ? AS A JOIN ? AS B ON A.id = B.id');
    const query = builder
      .setSource('A')
      .addJoin('JOIN', 'B', [{leftColumn: column('A', 'id'), operator: '=', rightColumn: column('B', 'id')}])
      .select([basicExpr(column('A', 'col1')), basicExpr(column('B', 'col2'))])
      .build();
    expect(query).toEqual(expectedQuery);
  });

  test('Select with a where clause', () => {
    const expectedQuery = format("SELECT A.col1 FROM ? AS A WHERE A.col2 = 'value'");
    const query = builder
      .setSource('A')
      .select([basicExpr(column('A', 'col1'))])
      .where([{leftColumn: column('A', 'col2'), operator: '=', rightValue: 'value'}])
      .build();
    expect(query).toEqual(expectedQuery);
  });

  test('Select with a group by clause', () => {
    const expectedQuery = format('SELECT A.col1 FROM ? AS A GROUP BY A.col1');
    const query = builder
      .setSource('A')
      .select([basicExpr(column('A', 'col1'))])
      .groupBy([column('A', 'col1')])
      .build();
    expect(query).toEqual(expectedQuery);
  });

  test('Select with an order by clause', () => {
    const expectedQuery = format('SELECT A.col1 FROM ? AS A ORDER BY A.col1 ASC');
    const query = builder
      .setSource('A')
      .select([basicExpr(column('A', 'col1'))])
      .orderBy([{column: column('A', 'col1'), direction: 'ASC'}])
      .build();
    expect(query).toEqual(expectedQuery);
  });

  test('Select with an aggregate function', () => {
    const expectedQuery = format('SELECT SUM(A.col1) AS sumCol FROM ? AS A');
    const query = builder
      .setSource('A')
      .select([renameExpr(aggregateExpr('SUM', basicExpr(column('A', 'col1'))), 'sumCol')])
      .build();
    expect(query).toEqual(expectedQuery);
  });

  test('Select with an arithmetic expression', () => {
    const expectedQuery = format('SELECT A.col1 + A.col2 AS sumCol FROM ? AS A');
    const query = builder
      .setSource('A')
      .select([renameExpr(arithmeticExpr('+', basicExpr(column('A', 'col1')), basicExpr(column('A', 'col2'))), 'sumCol')])
      .build();
    expect(query).toEqual(expectedQuery);
  });

  test('Select with a rename expression', () => {
    const expectedQuery = format('SELECT A.col1 AS renamedCol1 FROM ? AS A');
    const query = builder
      .setSource('A')
      .select([renameExpr(basicExpr(column('A', 'col1')), 'renamedCol1')])
      .build();
    expect(query).toEqual(expectedQuery);
  });

  test('Select with a complex expression', () => {
    const expectedQuery = format('SELECT SUM(A.col1) / B.col2 AS ratioCol FROM ? AS A JOIN ? AS B ON A.id = B.id');
    const query = builder
      .setSource('A')
      .addJoin('JOIN', 'B', [{leftColumn: column('A', 'id'), operator: '=', rightColumn: column('B', 'id')}])
      .select([renameExpr(arithmeticExpr('/', aggregateExpr('SUM', basicExpr(column('A', 'col1'))), basicExpr(column('B', 'col2'))), 'ratioCol')])
      .build();
    expect(query).toEqual(expectedQuery);
  });

  test('Select with a constant', () => {
    const expectedQuery = format("SELECT A.col1, 'my_constant' AS my_constant FROM ? AS A");
    const query = builder
      .setSource('A')
      .select([basicExpr(column('A', 'col1')), renameExpr(constantExpr('my_constant'), 'my_constant')])
      .build();
    expect(query).toEqual(expectedQuery);
  });

  test('Find errors when source node is not set', () => {
    const errors = builder.findErrors();
    expect(errors).toContain('Source node is not set.');
  });

  test('Find errors when no columns are selected', () => {
    const errors = builder.setSource('A').findErrors();
    expect(errors).toContain('At least one column must be selected.');
  });
});
