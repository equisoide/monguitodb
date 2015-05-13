module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            before_concat: [
                "src/util.js",
                "src/memory-storage.js",
                "src/document.js",
                "src/cursor.js",
                "src/collection.js",
                "src/monguito-db.js",
            ],
            after_concat: [
                "build/<%= pkg.buildName %>.js",
            ],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        qunit: {
            before_concat: [
                "test/util.html",
                "test/memory-storage.html"
            ],
            after_concat: [
                "test/monguito-db.html"
            ]
        },

        concat: {
            options: {
                separator: "\n\n",
                banner: "/*! <%= pkg.name %> v<%= pkg.version %> | " +
                        "<%= grunt.template.today() %> | " +
                        "(c) <%= pkg.author.name %> | " +
                        "<%= pkg.license %> license */\n" +
                        "(function (exports) {\n\n",
                footer: "\n\n})(window);"
            },
            dist: {
                src: [
                    "src/util.js",
                    "src/memory-storage.js",
                    "src/document.js",
                    "src/cursor.js",
                    "src/collection.js",
                    "src/monguito-db.js",
                ],
                dest: "build/<%= pkg.buildName %>.js"
            }
        },

        jsdoc : {
            dist : {
                src: [
                    "src/document.js",
                    "src/cursor.js",
                    "src/collection.js",
                    "src/monguito-db.js"
                ],
                options: {
                    destination: "doc",
                    private: false
                }
            }
        },

        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> v<%= pkg.version %> | " +
                        "<%= grunt.template.today() %> | " +
                        "(c) <%= pkg.author.name %> | " +
                        "<%= pkg.license %> license */\n"
            },
            dist: {
                files: {
                    "build/<%= pkg.buildName %>.min.js": ["<%= concat.dist.dest %>"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", [
        "jshint:before_concat",
        "qunit:before_concat",
        "concat",
        "jshint:after_concat",
        "uglify",
        "qunit:after_concat",
        "jsdoc"
    ]);
};