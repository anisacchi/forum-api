/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads',
      onDelete: 'CASCADE',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments',
      onDelete: 'CASCADE',
    },
    is_delete: {
      type: 'BOOLEAN',
      noNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
