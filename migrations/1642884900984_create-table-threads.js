/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    body: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    date: {
      type: "TEXT",
      notNull: true,
    },
  });

  pgm.addConstraint('threads','fk_threadsOwner.users_id','FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('threads','fk_threadsOwner.users_id');
  pgm.dropTable("threads");
};
