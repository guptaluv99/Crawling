var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var examSchema = mongoose.Schema({
    name: {type: String,required: true,unique:true},
    displayname: {type: String},
    seoname: {type: String},
    
    fullname: {type: String},
    exam_page_name: {type: String},
    coaching_page_name: {type: String},
    coaching_page_slug: {type: String},
    top_coaching_name: {type: String},
    urlslug: {type: String},
    top_coaching_urlslug: {type: String},
    n_top_coachings: {type: String},
    question_papers_urlslug: {type: String},
    
    frequency: {type: String},
    logo: String,
    briefDescription: {type: String},
    active: {type: Boolean, default:false},
    active2: {type: Boolean, default:false},
    //exam_page_active: {type: Boolean },
    rank: {type: Number, default: 0},
    stream: { type: Schema.ObjectId, ref: 'stream' },
    examresult: { type: Schema.ObjectId, ref: 'blogpost' },
    examdegrees: [{ type: Schema.ObjectId, ref: 'blogpost' }],
    exampattern: { type: Schema.ObjectId, ref: 'blogpost' },
    exambooks: { type: Schema.ObjectId, ref: 'blogpost' },
    examcounselling: { type: Schema.ObjectId, ref: 'blogpost' },
    resultFormat: {type: String},
    website: {type: String},
    
    /*Added on 20th June 2018*/
    
    _default_entrance_exam:{
        _courses: [{
            name: {type: String},
        }],
        _expected_salary_after_degree: {type: String},
    },
    
    recommended_for: {type: String}, //After X, After XII, During or After UG, During or After PG, Anytime
    exam_level: {type: String}, //National, State, University
    exam_type: {type: String}, //Entrance Exam, Recruitment Exam, Certification, Tuitions
    conducting_body: {type: String},
    
                                 
    registration:{
        website: {type: String},
        mode: {type: String},
        fee:{
            general_obc: {type: String},
            sc_st_ph: {type: String},
            females: {type: String},
            paymentModes: [{type: String}],
        },
        otherInformation:{type: String},
    },
    eqadFacebookPage: {type: String},
    eqadTelegramBot: {type: String},
    eqadLogo: {type: String},
    eqadCoverPhoto: {type: String},
    /*what: {type: String},
    brochure: {type: String},
    appear: {type: String},
    registration: {type: String},
    dates: {type: String},
    syllabus: {type: String},
    pattern: {type: String},
    preparation: {type: String},
    studysource: {type: String},
    previouspapers: {type: String},
    qualify: {type: String},
    colleges: {type: String},
    doubts: {type: String},*/
    
    links:[{
        url: {type: String},
        description: {type: String},
    }],
    cycle: [{
        _entrance_exam: {
            _institutions:[{
                institute: {type: String},
                city: {type: String},
            }], 
            _courses: [{
                name: {type: String},
            }],
            _expected_salary_after_degree: {type: String},
        },
        _recruitment_exam:{
            _recruiting_organisations:[{
                body: {type: String},
                vacancies: {type: String},
            }],
            _positions: [{
                position: {type: String},
                salary: {type: String},
            }],
        },
        name: {type: String, required: true},
        description: {type: String},
        year: {type: String, required: true},
        cycleNumber: {type: String, required: true},
        /*name: {type: String, required: true},
        description: {type: String},*/
        active: {type: Boolean, default:'false'},
        qpactive: {type: Boolean, default:'false'},
        
        studentsAppearing: {type: String},
        studentSeats: {type: String},
        brochure: [{
            name: {type: String},
            description: {type: String},
            url: {type: String, required: true},
        }],
        syllabus: [{
            name: {type: String},
            description: {type: String},
            url: {type: String, required: true},
        }],
        docs: [{
            name: {type: String},
            description: {type: String},
            url: {type: String, required: true},
        }],
        
        
        examMode: {type: Boolean, default:'false'}, //true means online only, false means other than online also.
        examMode2: {type: String},
        
        examSteps:[{
            name: {type: String},
            otherName: {type: String},
            description: {type: String},
            _tentative: {type: Boolean, default: false},
            stepType: {type: String}, //"Registration", "Admit Card", "Written", "Counselling", "Interview"
            /*Added on 20th June 2018*/
            exam_format: {type: String}, //Objective, Subjective, Both | Only relevant for stepType Written
            stepDate:{
                dateRangeBool: {type: Boolean, default:'false'},
                timeRangeBool: {type: Boolean, default:'false'}, //true is full day
                dateRange:{
                    startDate: { type: Date },
                    endDate: { type: Date },
                },
                dateArray:[{ type: Date }],
                allDates:[{ type: Date }],
                timeRange:[{
                    startTime: { type: String },
                    endTime: { type: String },
                }],
                dates:[{
                    start: { type: Date },
                    end: { type: Date },
                    name: { type: String },
                }],
            },
        }],
        examStepInstructions: { type: String },
        steps: {
            registration: {type: Boolean},
            admitCard: {type: Boolean},
            examDate: {type: Boolean},
            writtenResultDate: {type: Boolean},
            counselling: {type: Boolean},
            interview: {type: Boolean},
            finalResultDate: {type: Boolean},
            text: {type: String}
        },
        examdates:{
            registration:{
                start: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                end: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                endwithlatefees: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                text: {type: String},
            },
            admitCard:{
                start: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                end: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                text: {type: String},
            },
            examDate:{
                start: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                end: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                text: {type: String},
            },
            writtenResultDate:{
                start: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                end: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                text: {type: String},
            },
            counselling:{
                start: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                end: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                text: {type: String},
            },
            interview:{
                start: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                end: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                text: {type: String},
            },
            finalResultDate:{
                start: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                end: {
                    _date: { type: Date },
                    tentative: {type: Boolean, default:'false'},
                    applicable: {type: Boolean, default:'false'},
                },
                text: {type: String},
            },
        },
        
        
    }],
    officialpaperscoverphoto: {type: String},
    _rssarticleKeywords: [{type: String}],
    _opSimulated: {type: Boolean, default: false},
});
examSchema.plugin(deepPopulate);
module.exports = mongoose.model('exam', examSchema);